import { useState, useEffect, useRef, useCallback } from "react";
import UsernameInput from "../components/UsernameInput";
import AtSymbol from "../components/AtSymbol";
import DomainInput from "../components/DomainInput";
import { isEmailComplete } from "../utils/validateEmail";
import "../styles/emailEscape.css";

export default function EmailEscapePage() {
    const [username, setUsername] = useState("");
    const [domain, setDomain] = useState("");
    const [atFlying, setAtFlying] = useState(false);
    const [atPos, setAtPos] = useState({ top: 0, left: 0 });
    const [gameActive, setGameActive] = useState(false);
    const [inactivityTime, setInactivityTime] = useState(0);
    const [atCaught, setAtCaught] = useState(false);
    const containerRef = useRef(null);
    const flyingIntervalRef = useRef(null);
    const inactivityIntervalRef = useRef(null);
    const speedRef = useRef(600); 

    const isEmailValid = isEmailComplete(username, domain);

    const moveAtRandom = useCallback(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const maxTop = container.clientHeight - 60;
        const maxLeft = container.clientWidth - 60;
        const top = Math.floor(Math.random() * maxTop);
        const left = Math.floor(Math.random() * maxLeft);
        setAtPos({ top, left });
    }, []);

    const startFlying = useCallback(() => {
        if (isEmailValid) return;
        setAtFlying(true);
        setGameActive(true);
        moveAtRandom();
        speedRef.current = 600; 

        if (flyingIntervalRef.current) clearInterval(flyingIntervalRef.current);

        const fly = () => {
            moveAtRandom();
         if (speedRef.current > 300) speedRef.current -= 50;
            clearInterval(flyingIntervalRef.current);
            flyingIntervalRef.current = setInterval(fly, speedRef.current);
        };

        flyingIntervalRef.current = setInterval(fly, speedRef.current);
    }, [moveAtRandom, isEmailValid]);

    const stopFlying = useCallback(() => {
        setAtFlying(false);
        setGameActive(false);
        setInactivityTime(0);
        if (flyingIntervalRef.current) {
            clearInterval(flyingIntervalRef.current);
            flyingIntervalRef.current = null;
        }
    }, []);

   useEffect(() => {
        if (isEmailValid) {
            if (inactivityIntervalRef.current) {
                clearInterval(inactivityIntervalRef.current);
                inactivityIntervalRef.current = null;
            }
            return;
        }

        if (!gameActive && !inactivityIntervalRef.current) {
            inactivityIntervalRef.current = setInterval(() => {
                setInactivityTime(prev => {
                    const newTime = prev + 1;
                    if (newTime >= 5) {
                        startFlying();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (inactivityIntervalRef.current) {
                clearInterval(inactivityIntervalRef.current);
                inactivityIntervalRef.current = null;
            }
        };
    }, [isEmailValid, gameActive, startFlying]);

    useEffect(() => {
        if (!isEmailValid) setInactivityTime(0);
    }, [username, domain, isEmailValid]);

    useEffect(() => {
        return () => {
            if (flyingIntervalRef.current) clearInterval(flyingIntervalRef.current);
            if (inactivityIntervalRef.current) clearInterval(inactivityIntervalRef.current);
        };
    }, []);

    const handleAtClick = useCallback(() => {
        if (atFlying) {
            stopFlying();
            setAtCaught(true);
        }
    }, [atFlying, stopFlying]);

    const getGameMessage = () => {
        if (isEmailValid && atCaught) return "✅ Email valide ! Le @ est sécurisé.";
        if (gameActive) return "🎯 Attrapez le @ qui s'échappe ! Cliquez dessus pour le capturer.";
        if (inactivityTime > 0) return `⏳ Le @ s'échappera dans ${5 - inactivityTime}s si l'email n'est pas complété...`;
    };

    return (
        <div className="email-escape-container" ref={containerRef}>
            
            <div className="email-field">
                <UsernameInput value={username} onChange={setUsername} />
                <AtSymbol
                    flying={atFlying}
                    style={{ 
                        position: atFlying ? 'absolute' : 'static',
                        top: atFlying ? atPos.top : 'auto',
                        left: atFlying ? atPos.left : 'auto'
                    }}
                    onClick={handleAtClick}
                />
                <DomainInput value={domain} onChange={setDomain} />
            </div>
            
            <div className="game-info">
                <p>{getGameMessage()}</p>
            </div>
        </div>
    );
}