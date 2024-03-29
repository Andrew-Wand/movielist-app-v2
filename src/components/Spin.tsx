import { DocumentData } from "firebase/firestore";
import WheelComponent from "react-wheel-of-prizes";

type SpinPageProps = {
  movielist: DocumentData;
};

interface MovieData {
  data: DocumentData;
}

function Spin({ movielist }: SpinPageProps) {
  const movieNames = movielist?.map((movie: MovieData) => movie.data.movieName);
  const segments = movieNames;
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
    "#78B0A0",
    "#81B214",
    "#A64452",
    "#6A097D",
    "#295F4E",
  ];

  const onFinished = (winner: string) => {
    console.log(winner);
  };

  return (
    <div className="wheel-wrapper overflow-hidden lg:pb-20">
      <div className="wheel-text">
        <h3>Spin the Wheel!</h3>
      </div>
      <div className="wheel-container">
        <WheelComponent
          segments={segments}
          segColors={segColors}
          onFinished={(winner: string) => onFinished(winner)}
          primaryColor="#388cb3"
          contrastColor="#0e141b"
          buttonText="Spin"
          isOnlyOnce={false}
          size={290}
          upDuration={100}
          downDuration={1000}
          fontFamily="Staatliches"
        />
      </div>
    </div>
  );
}

export default Spin;
