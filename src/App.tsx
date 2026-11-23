import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { AuthModal } from './components/AuthModal';
import { CatalogSection, SortOrder } from './components/CatalogSection';
import { DossierSection } from './components/DossierSection';
import { EditorialHero } from './components/EditorialHero';
import { FederalRoutesSection } from './components/FederalRoutesSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ItemDetailModal } from './components/ItemDetailModal';
import { SavedListDrawer } from './components/SavedListDrawer';
import { SuggestModal } from './components/SuggestModal';
import { INITIAL_CATALOG } from './data/cultureCatalog';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { CultureCategory, CultureEra, CultureItem, UserProfile } from './types/culture';

const STORAGE_SAVED_KEY = 'meridiano_sur_saved_ids_v1';
const STORAGE_NOTES_KEY = 'meridiano_sur_notes_v1';

function readStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [communityItems, setCommunityItems] = useState<CultureItem[]>([]);
  const [localSavedIds, setLocalSavedIds] = useState<string[]>(() =>
    readStoredJson<string[]>(STORAGE_SAVED_KEY, ['lib-ficciones', 'cin-nueve-reinas', 'tea-coleman'])
  );
  const [localNotesMap, setLocalNotesMap] = useState<Record<string, string>>(() =>
    readStoredJson<Record<string, string>>(STORAGE_NOTES_KEY, {})
  );

  const [cloudSavedIds, setCloudSavedIds] = useState<string[]>([]);
  const [cloudNotesMap, setCloudNotesMap] = useState<Record<string, string>>({});

  const [selectedCategory, setSelectedCategory] = useState<CultureCategory | 'all'>('all');
  const [selectedEra, setSelectedEra] = useState<CultureEra | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('curated');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const noteDebounceRef = useRef<Record<string, number>>({});

  // Persist guest preferences locally
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(localSavedIds));
    } catch {
      // Ignore storage errors
    }
  }, [localSavedIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(localNotesMap));
    } catch {
      // Ignore storage errors
    }
  }, [localNotesMap]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);

      if (!firebaseUser) {
        setProfile(null);
        setCloudSavedIds([]);
        setCloudNotesMap({});
        return;
      }

      const profilePath = `users/${firebaseUser.uid}/public/profile`;
      const privatePath = `users/${firebaseUser.uid}/private/info`;
      try {
        const profileRef = doc(db, 'users', firebaseUser.uid, 'public', 'profile');
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setProfile({
            uid: firebaseUser.uid,
            displayName: String(data.displayName || firebaseUser.displayName || 'Lector argentino'),
            province: String(data.province || 'CABA'),
            favoriteDiscipline: (data.favoriteDiscipline as CultureCategory) || 'libros',
          });
        } else {
          const defaultName = (
            firebaseUser.displayName ||
            firebaseUser.email?.split('@')[0] ||
            'Lector argentino'
          ).slice(0, 80);

          const batch = writeBatch(db);
          batch.set(profileRef, {
            uid: firebaseUser.uid,
            displayName: defaultName,
            province: 'CABA',
            favoriteDiscipline: 'libros',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          batch.set(doc(db, 'users', firebaseUser.uid, 'private', 'info'), {
            uid: firebaseUser.uid,
            email: (firebaseUser.email || 'sin-correo@meridianosur.ar').slice(0, 160),
            createdAt: serverTimestamp(),
          });
          await batch.commit();

          setProfile({
            uid: firebaseUser.uid,
            displayName: defaultName,
            province: 'CABA',
            favoriteDiscipline: 'libros',
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${profilePath} | ${privatePath}`);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to public community recommendations
  useEffect(() => {
    const recsQuery = query(collection(db, 'recommendations'), where('isPublic', '==', true));
    const unsubscribe = onSnapshot(
      recsQuery,
      (snapshot) => {
        const loaded: CultureItem[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          loaded.push({
            id: docSnap.id,
            accessionCode: String(d.accessionCode || 'AR-COM'),
            title: String(d.title || ''),
            creator: String(d.creator || ''),
            year: Number(d.year || 2024),
            category: (d.category as CultureCategory) || 'libros',
            era: (d.era as CultureEra) || 'contemporaneo',
            genre: String(d.genre || ''),
            location: String(d.location || ''),
            province: String(d.province || 'Argentina'),
            summary: String(d.summary || ''),
            editorialEssay: String(d.editorialEssay || d.summary || ''),
            whereToExperience: String(d.whereToExperience || ''),
            isUserSubmitted: true,
            authorUid: String(d.authorUid || ''),
            authorName: String(d.authorName || ''),
          });
        });
        setCommunityItems(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'recommendations');
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to authenticated user's saved cultural items
  useEffect(() => {
    if (!authReady || !user) return;
    const savedPath = `users/${user.uid}/savedItems`;
    const savedQuery = query(collection(db, savedPath), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      savedQuery,
      (snapshot) => {
        const ids: string[] = [];
        const notes: Record<string, string> = {};
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          const itemId = String(d.itemId || docSnap.id);
          ids.push(itemId);
          if (typeof d.note === 'string' && d.note.length > 0) {
            notes[itemId] = d.note;
          }
        });
        setCloudSavedIds(ids);
        setCloudNotesMap(notes);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, savedPath);
      }
    );

    return () => unsubscribe();
  }, [authReady, user]);

  const savedIds = user ? cloudSavedIds : localSavedIds;
  const notesMap = user ? cloudNotesMap : localNotesMap;

  const allItems = useMemo(() => [...communityItems, ...INITIAL_CATALOG], [communityItems]);

  const countsByCategory = useMemo(() => {
    const counts: Record<CultureCategory, number> = {
      libros: 0,
      cine: 0,
      teatro: 0,
      musica: 0,
      espacios: 0,
    };
    for (const item of allItems) {
      counts[item.category] += 1;
    }
    return counts;
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = allItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedEra !== 'all' && item.era !== selectedEra) return false;

      if (q) {
        const haystack = [
          item.title,
          item.creator,
          item.genre,
          item.location,
          item.province,
          item.summary,
          item.whereToExperience,
          item.accessionCode,
          item.authorName ?? '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    if (sortOrder === 'newest') {
      return [...filtered].sort((a, b) => b.year - a.year);
    }
    if (sortOrder === 'oldest') {
      return [...filtered].sort((a, b) => a.year - b.year);
    }
    return filtered;
  }, [allItems, selectedCategory, selectedEra, searchQuery, sortOrder]);

  const activeItem = useMemo(
    () => allItems.find((item) => item.id === activeItemId) ?? null,
    [allItems, activeItemId]
  );

  const relatedItems = useMemo(() => {
    if (!activeItem) return [];
    return allItems
      .filter((item) => item.category === activeItem.category && item.id !== activeItem.id)
      .slice(0, 2);
  }, [allItems, activeItem]);

  const savedItems = useMemo(
    () => allItems.filter((item) => savedIds.includes(item.id)),
    [allItems, savedIds]
  );

  const handleGoogleSignIn = useCallback(async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
      if (msg.includes('popup-closed-by-user')) {
        setAuthError('Cerraste la ventana de ingreso antes de completar el registro.');
      } else {
        setAuthError('No pudimos conectar con Google en este momento. Intentá nuevamente.');
      }
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleSaveProfile = useCallback(
    async (displayName: string, province: string, favoriteDiscipline: CultureCategory) => {
      if (!user) return;
      const profilePath = `users/${user.uid}/public/profile`;
      try {
        await updateDoc(doc(db, 'users', user.uid, 'public', 'profile'), {
          displayName: displayName.slice(0, 80),
          province: province.slice(0, 60),
          favoriteDiscipline,
          updatedAt: serverTimestamp(),
        });
        setProfile({
          uid: user.uid,
          displayName: displayName.slice(0, 80),
          province: province.slice(0, 60),
          favoriteDiscipline,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, profilePath);
      }
    },
    [user]
  );

  const handleSignOut = useCallback(async () => {
    await signOut(auth);
    setIsAuthModalOpen(false);
  }, []);

  const handleToggleSave = useCallback(
    async (itemId: string) => {
      if (!user) {
        setLocalSavedIds((prev) =>
          prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [itemId, ...prev]
        );
        return;
      }

      const itemPath = `users/${user.uid}/savedItems/${itemId}`;
      const ref = doc(db, 'users', user.uid, 'savedItems', itemId);
      const isCurrentlySaved = cloudSavedIds.includes(itemId);

      try {
        if (isCurrentlySaved) {
          await deleteDoc(ref);
        } else {
          await setDoc(ref, {
            userId: user.uid,
            itemId: itemId.slice(0, 80),
            note: (cloudNotesMap[itemId] ?? '').slice(0, 500),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(
          error,
          isCurrentlySaved ? OperationType.DELETE : OperationType.CREATE,
          itemPath
        );
      }
    },
    [user, cloudSavedIds, cloudNotesMap]
  );

  const handleUpdateNote = useCallback(
    (itemId: string, note: string) => {
      const clamped = note.slice(0, 500);
      if (!user) {
        setLocalNotesMap((prev) => ({ ...prev, [itemId]: clamped }));
        return;
      }

      // Immediate optimistic UI update
      setCloudNotesMap((prev) => ({ ...prev, [itemId]: clamped }));

      if (noteDebounceRef.current[itemId]) {
        window.clearTimeout(noteDebounceRef.current[itemId]);
      }

      noteDebounceRef.current[itemId] = window.setTimeout(async () => {
        const itemPath = `users/${user.uid}/savedItems/${itemId}`;
        const ref = doc(db, 'users', user.uid, 'savedItems', itemId);
        try {
          const snap = await getDoc(ref);
          if (snap.exists()) {
            await updateDoc(ref, {
              note: clamped,
              updatedAt: serverTimestamp(),
            });
          } else {
            await setDoc(ref, {
              userId: user.uid,
              itemId: itemId.slice(0, 80),
              note: clamped,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, itemPath);
        }
      }, 450);
    },
    [user]
  );

  const handleClearSaved = useCallback(async () => {
    if (!user) {
      setLocalSavedIds([]);
      return;
    }
    const batch = writeBatch(db);
    for (const id of cloudSavedIds) {
      batch.delete(doc(db, 'users', user.uid, 'savedItems', id));
    }
    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/savedItems`);
    }
  }, [user, cloudSavedIds]);

  const handleAddRecommendation = useCallback(
    async (newItem: CultureItem) => {
      if (!user) return;
      const recPath = `recommendations/${newItem.id}`;
      const authorDisplay = (
        profile?.displayName ||
        user.displayName ||
        'Lector argentino'
      ).slice(0, 80);

      try {
        await setDoc(doc(db, 'recommendations', newItem.id), {
          id: newItem.id,
          accessionCode: newItem.accessionCode,
          title: newItem.title,
          creator: newItem.creator,
          year: newItem.year,
          category: newItem.category,
          era: newItem.era,
          genre: newItem.genre,
          location: newItem.location,
          province: newItem.province,
          summary: newItem.summary,
          editorialEssay: newItem.editorialEssay,
          whereToExperience: newItem.whereToExperience,
          authorUid: user.uid,
          authorName: authorDisplay,
          isPublic: true,
          createdAt: serverTimestamp(),
        });

        await setDoc(doc(db, 'users', user.uid, 'savedItems', newItem.id), {
          userId: user.uid,
          itemId: newItem.id,
          note: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setSelectedCategory(newItem.category);
        setSelectedEra('all');
        setSearchQuery('');
        const catalogEl = document.getElementById('catalogo');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, recPath);
      }
    },
    [user, profile]
  );

  const handleDeleteCommunityItem = useCallback(
    async (itemId: string) => {
      if (!user) return;
      const recPath = `recommendations/${itemId}`;
      try {
        await deleteDoc(doc(db, 'recommendations', itemId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, recPath);
      }
    },
    [user]
  );

  const handleSelectCategoryAndScroll = (category: CultureCategory) => {
    setSelectedCategory(category);
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedEra('all');
    setSearchQuery('');
    setSortOrder('curated');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FD] text-[#0B2239]">
      <Header
        savedCount={savedItems.length}
        userDisplayName={profile?.displayName ?? user?.displayName ?? null}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenSuggest={() => setIsSuggestModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1">
        <EditorialHero
          countsByCategory={countsByCategory}
          isAuthenticated={Boolean(user)}
          onSelectCategoryAndScroll={handleSelectCategoryAndScroll}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        <DossierSection
          onOpenItem={(id) => setActiveItemId(id)}
          onFilterCategory={handleSelectCategoryAndScroll}
        />

        <CatalogSection
          items={filteredItems}
          totalCount={allItems.length}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedEra={selectedEra}
          onEraChange={setSelectedEra}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onOpenItem={(id) => setActiveItemId(id)}
          onOpenSuggest={() => setIsSuggestModalOpen(true)}
          onResetFilters={handleResetFilters}
        />

        <FederalRoutesSection allItems={allItems} onOpenItem={(id) => setActiveItemId(id)} />
      </main>

      <Footer
        onSelectCategory={handleSelectCategoryAndScroll}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isAuthenticated={Boolean(user)}
      />

      <ItemDetailModal
        item={activeItem}
        relatedItems={relatedItems}
        isSaved={activeItem ? savedIds.includes(activeItem.id) : false}
        isAuthenticated={Boolean(user)}
        currentUserUid={user?.uid ?? null}
        userNote={activeItem ? (notesMap[activeItem.id] ?? '') : ''}
        onUpdateNote={handleUpdateNote}
        onToggleSave={handleToggleSave}
        onDeleteCommunityItem={handleDeleteCommunityItem}
        onSelectRelated={(id) => setActiveItemId(id)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onClose={() => setActiveItemId(null)}
      />

      <SavedListDrawer
        isOpen={isSavedDrawerOpen}
        isAuthenticated={Boolean(user)}
        savedItems={savedItems}
        notesMap={notesMap}
        onClose={() => setIsSavedDrawerOpen(false)}
        onRemoveItem={handleToggleSave}
        onOpenItem={(id) => setActiveItemId(id)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onClearAll={handleClearSaved}
      />

      <SuggestModal
        isOpen={isSuggestModalOpen}
        isAuthenticated={Boolean(user)}
        authorName={profile?.displayName ?? user?.displayName ?? null}
        onClose={() => setIsSuggestModalOpen(false)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onAddRecommendation={handleAddRecommendation}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        user={user}
        profile={profile}
        authLoading={authLoading}
        authError={authError}
        onClose={() => setIsAuthModalOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
        onSaveProfile={handleSaveProfile}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
