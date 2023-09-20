import Spin from "../components/Spin";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase.config";
import Loading from "../components/Loading";

interface MovieData {
  data: DocumentData;
  id: string;
}

function SpinPage() {
  const [movielist, setmovieList] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movielistRef = collection(db, "movieslist");

        const q = query(
          movielistRef,
          where("userRef", "==", auth.currentUser?.uid)
        );

        const querySnap = await getDocs(q);

        const movielistItems: MovieData[] = [];

        querySnap.docs.map((doc) => {
          return movielistItems.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setmovieList(movielistItems);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovies();
  }, [loading]);

  return (
    <main>
      {loading ? (
        <Loading />
      ) : (
        <div className="">
          <Spin movielist={movielist} />
        </div>
      )}
    </main>
  );
}

export default SpinPage;
