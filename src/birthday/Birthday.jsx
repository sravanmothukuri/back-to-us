import React, { useState, useEffect, useRef } from "react";
import FloatingSymbols from "./components/FloatingSymbols";
import RectangleText from "./components/RectangleText";
import PhotoCarousel from "./components/PhotoCarousel";
import RadhakrishnaImage from "./assets/vyshusravan.jpg";
import music from "./assets/music.m4a";
import flyingImage from "./assets/image.png";
import balloonImage from "./assets/balloon.png";
import birthdayVideo from "./assets/birthday.mp4";
import cakeImage from "./assets/Cake.png";
import "./Birthday.css";

// The original birthday card (January 2025), kept as it was.
// Only changes: scoped CSS, music stops on exit, tap works like Enter on phones,
// and an exit button back to Back to Us.
function BirthdayCard() {
  const [step, setStep] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [showNewPage, setShowNewPage] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [balloonVisible, setBalloonVisible] = useState(false);
  const [cakeVisible, setCakeVisible] = useState(false);
  const [messageTransition, setMessageTransition] = useState("fade-in");
  const [showSpecialMessageButton, setShowSpecialMessageButton] = useState(false);
  const [hideMessageAndButton, setHideMessageAndButton] = useState(false);
  const [showSpecialMessage, setShowSpecialMessage] = useState(false);
  const [showPhotosPage, setShowPhotosPage] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  const messages = [
    "It's Your Special Day Yeyey🥳🥳!!",
    "I Have Made Something For You Nanna😌💗",
    "Do You Wanna See What I Made? Let's Go!!",
  ];

  const handleLightsOn = () => {
    setShowNewPage(true);
  };

  const handlePlayMusic = () => {
    if (!musicPlaying) {
      setMusicPlaying(true);
      const audioObj = new Audio(music);
      audioObj.loop = true;
      audioObj.play().catch(() => {});
      audioRef.current = audioObj;
    }
  };

  const handleDecorateClick = () => {
    setImageVisible(true);
  };

  const handleFlyBalloons = () => {
    setBalloonVisible(true);
  };

  const handleCakeCutClick = () => {
    setCakeVisible(true);
  };

  const handleCakeImageRightClick = (e) => {
    e.preventDefault();
    setHideMessageAndButton(true);
    setShowSpecialMessageButton(true);
  };

  const handleSpecialMessageClick = () => {
    setShowSpecialMessage(true);
  };

  const handlePhotosClick = () => {
    setShowPhotosPage(true);
    setShowSpecialMessage(false);
  };

  const resetToInitialState = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setShowSpecialMessage(false);
    setStep(0);
    setIsEnd(false);
    setShowNewPage(false);
    setMusicPlaying(false);
    setImageVisible(false);
    setBalloonVisible(false);
    setCakeVisible(false);
    setHideMessageAndButton(false);
    setShowSpecialMessageButton(false);
    setShowPhotosPage(false);
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      if (step < messages.length - 1) {
        setMessageTransition("fade-out");
        setTimeout(() => {
          setStep((prev) => prev + 1);
          setMessageTransition("fade-in");
          
          // Directly set isEnd to true when reaching the last message
          if (step === messages.length - 2) {
            setIsEnd(true);
          }
        }, 1000);
      } else {
        // Ensure isEnd is set when on the last message
        if (!isEnd) {
          setIsEnd(true);
          return;
        }
        
        if (!showNewPage) {
          handleLightsOn();
        } else if (!musicPlaying) {
          handlePlayMusic();
        } else if (!imageVisible) {
          handleDecorateClick();
        } else if (!balloonVisible) {
          handleFlyBalloons();
        } else if (balloonVisible && !cakeVisible) {
          handleCakeCutClick();
        } else if (cakeVisible && !hideMessageAndButton && !showSpecialMessageButton) {
          setHideMessageAndButton(true);
          setShowSpecialMessageButton(true);
        } else if (showSpecialMessageButton && !showSpecialMessage) {
          handleSpecialMessageClick();
        } else if (showSpecialMessage && !showPhotosPage) {
          handlePhotosClick();
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEnterKey);
    return () => {
      window.removeEventListener("keydown", handleEnterKey);
    };
  }, [step, isEnd, showNewPage, musicPlaying, imageVisible, showSpecialMessage]);

  // PhotoCarousel Render
  if (showPhotosPage) {
    return <PhotoCarousel onReset={resetToInitialState} />;
  }

  // Special Message Render
  if (showSpecialMessage) {
    return (
      <div className="App" style={{ backgroundColor: "#f8e2e7", height: "100vh" }}>
        <FloatingSymbols />
        <RectangleText messages={["*Happy Birthday To You Nanna 🥹💗* Four Years Avutundhi Nanna Inka 5days ki Nuvu Naatho First Time Maatladi,Nuvu Parichayam Ayyinappudu nunchi Nanna First Priority,School Valla Anna gaa Parichayam ayya But Destiny anedhi Undhi ani Ardham Ayyindhi Nanna Manam elaa Kaavalo Manake Teliselaa Chesi Kalipindhi 😭🩷,You Are The Only Person In My Heart Not Matter What the Relation nanna 🥹🩷,This Last One Year We Have Spent So Many Memorable Moments Nanna 😌💗,I Like the Way You Call me *Nanna🥹💘* Nenu Entha Tenction lo Unna nee aa Pilupu tho Cool Ayipotha raa,We Have so Many Loveable Moments Which Make Me Blush Everytime I remember About them 😁🩷....Jeevithantham Nuvu Nenu Happy Gaa Kalisi Undham Nanna 😭💗....Iddaram Kalisi Ilanti Birthday Kalisi Jarupukundham,Inka Konni Years Tarvatha mana Iddaru Ledha Mugguru Pillalatho Jarupukundham Okk Naa Bday Babe 😁😁😁...*.I Love You Nannaluuu 🥹🩷*.....*I Miss You Sooo Much Bujjoduu😭🩷*...Thappakunda Next Bday kalisi Chesukundhaam I Promise Nanna.....Once Again Happy Birthday Nanna 🩷 *Lets Shower Love On Each Other till Lifelong♾️🩷* ....Eppudu Chinni Godavalu Paduthu...Kaburluu Cheppukuntu Gadipedham Nanna 😁💗"]} transition={messageTransition} />
        <div
          style={{
            position: "absolute",
            bottom: "1.8%",
            width: "100%",
            zIndex: 2,
            opacity:0.9,
          
            textAlign: "center",
          }}
        >
          <button
            onClick={handlePhotosClick}
            style={{
              backgroundColor: "Pink",
              color: "Black",
              border: "none",
              borderRadius: "20px",
              padding: "10px 20px",
              fontWeight:"bold",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            Photos Choodhama Babyy
          </button>
        </div>
      </div>
    );
  }

  // Birthday Video Render
  if (isEnd && !showNewPage) {
    return (
      <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
        <video
          src={birthdayVideo}
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        ></video>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "10px",
            textAlign: "center",
            fontFamily: "Lexend",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Many More Happy Returns of the Day Babyy!!! 
          <br />
          I have Planned more.Click on "Lights On"
        </div>

        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <button
            onClick={handleLightsOn}
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "10px 20px",
              fontSize: "1.2rem",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            Lights On
          </button>
        </div>
      </div>
    );
  }

  // New Page with Decorations Render
  if (showNewPage) {
    return (
      <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
        <div
          style={{
            backgroundImage: `url(${RadhakrishnaImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            width: "100vw",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0.8,
            zIndex: -1,
          }}
        ></div>

        {!musicPlaying && (
          <div
            style={{
              position: "absolute",
              top: "5%",
              width: "100%",
              textAlign: "center",
            }}
          >
            <button
              onClick={handlePlayMusic}
              style={{
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "10px 20px",
                opacity:0.6,
                fontSize: "1.2rem",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Play Music
            </button>
          </div>
        )}

        {musicPlaying && !imageVisible && (
          <div
            style={{
              position: "absolute",
              top: "5%",
              width: "100%",
              textAlign: "center",
            }}
          >
            <button
              onClick={handleDecorateClick}
              style={{
                backgroundColor: "blue",
                color: "white",
                border: "none",
                opacity:0.6,
                borderRadius: "20px",
                padding: "10px 20px",
                fontSize: "1.2rem",
            
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Decorate
            </button>
          </div>
        )}

        {imageVisible && (
          <>
            <img
              src={flyingImage}
              alt="Flying Decoration"
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                opacity:0.5,
                transform: "translate(-50%, -50%)",
                width: "650px",
                maxWidth: "90vw",
              }}
            />
            {!balloonVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "5%",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={handleFlyBalloons}
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    opacity:0.6,
                    padding: "10px 20px",
                    fontSize: "1.2rem",
                    cursor: "pointer",
              
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Fly Balloons
                </button>
              </div>
            )}
          </>
        )}

        {balloonVisible && (
          <div className="balloon-container">
            {Array.from({ length: 15 }).map((_, index) => (
              <img
                key={index}
                src={balloonImage}
                alt="Balloon"
                className="balloon"
              />
            ))}
          </div>
        )}

{balloonVisible && !cakeVisible && (
  <div
    style={{
      position: "absolute",
      top: "5%",
      left: "50%",
      transform: "translateX(-50%)",
    }}
  >
    <button
      onClick={handleCakeCutClick}
      style={{
        backgroundColor: "blue",
        color: "white",
        border: "none",
        borderRadius: "20px",
        opacity:0.6,
        padding: "10px 20px",
        fontSize: "1.2rem",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      Cake Cut Cheddama?
    </button>
  </div>
)}

        {cakeVisible && !hideMessageAndButton && (
          <>
            <img
              src={cakeImage}
              alt="Cake"
              style={{
                position: "absolute",
                bottom: "10%",
                left: "51%",
                transform: "translateX(-50%)",
                width: "290px",
            
                cursor: "pointer",
              }}
              onContextMenu={handleCakeImageRightClick}
            />
            <div
              style={{
                position: "absolute",
                bottom: "25%",
                right: "5%",
                backgroundColor: "rgba(160, 160, 160, 0.6)",
                color: "black",
                borderRadius: "30px",
                padding: "10px 20px",
                fontSize: "1.2rem",
                fontFamily:"Lexend",
                fontWeight: "normal",
                textAlign: "center",
              }}
            >
              Cake meedha Right Click chey Bangaram
            </div>
          </>
        )}

        {showSpecialMessageButton && (
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <button
              onClick={handleSpecialMessageClick}
              style={{
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "20px",
                opacity:0.6,
                padding: "10px 20px",
                fontSize: "1.2rem",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Click to See the Special Message
            </button>
          </div>
        )}
      </div>
    );
  }

  // Initial Render
  return (
    <div
      className="App"
      style={{
        backgroundColor: "#f8e2e7",
        height: "100vh",
        transition: "background-color 0.5s ease",
      }}
    >
      <FloatingSymbols />
      <RectangleText messages={messages} transition={messageTransition} />
    </div>
  );
}


const pressEnter = () =>
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

export default function Birthday({ onExit }) {
  return (
    <div className="bday-root">
      <button className="bday-exit" onClick={onExit}>
        ← Back to Us ki
      </button>
      <div onClick={(e) => e.target.tagName !== "BUTTON" && e.target.tagName !== "IMG" && pressEnter()}>
        <BirthdayCard />
      </div>
      <p className="bday-hint">Enter press chey, leda screen meedha tap chey ✨</p>
    </div>
  );
}