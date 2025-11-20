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
    const containerRef = useRef(null);
    const flyingIntervalRef = useRef(null);
    const inactivityIntervalRef = useRef(null);

    // Déplacer @ aléatoirement
    const moveAtRandom = useCallback(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const maxTop = container.clientHeight - 60;
        const maxLeft = container.clientWidth - 60;
        const top = Math.floor(Math.random() * maxTop);
        const left = Math.floor(Math.random() * maxLeft);
        setAtPos({ top, left });
    }, []);

    // Démarrer le mouvement du @
    const startFlying = useCallback(() => {
        setAtFlying(true);
        setGameActive(true);
        moveAtRandom(); // Position initiale aléatoire
        
        // Mouvement continu toutes les 2 secondes
        flyingIntervalRef.current = setInterval(moveAtRandom, 2000);
    }, [moveAtRandom]);

    // Arrêter le mouvement du @
    const stopFlying = useCallback(() => {
        setAtFlying(false);
        setGameActive(false);
        setInactivityTime(0);
        if (flyingIntervalRef.current) {
            clearInterval(flyingIntervalRef.current);
            flyingIntervalRef.current = null;
        }
    }, []);

    // Vérifier si l'email est complet et valide
    const isEmailValid = isEmailComplete(username, domain);

    // Timer d'inactivité - 10 secondes seulement si l'email n'est pas complet
    useEffect(() => {
        if (isEmailValid) {
            // Email complet - arrêter tout
            stopFlying();
            if (inactivityIntervalRef.current) {
                clearInterval(inactivityIntervalRef.current);
                inactivityIntervalRef.current = null;
            }
            return;
        }

        // Démarrer le compte à rebours seulement si l'email n'est pas complet
        if (!gameActive && !inactivityIntervalRef.current) {
            inactivityIntervalRef.current = setInterval(() => {
                setInactivityTime(prev => {
                    const newTime = prev + 1;
                    if (newTime >= 10) {
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
    }, [username, domain, gameActive, isEmailValid, startFlying, stopFlying]);

    // Réinitialiser le timer quand l'utilisateur tape
    useEffect(() => {
        if (!isEmailValid) {
            setInactivityTime(0);
        }
    }, [username, domain, isEmailValid]);

    // Nettoyage des intervals
    useEffect(() => {
        return () => {
            if (flyingIntervalRef.current) clearInterval(flyingIntervalRef.current);
            if (inactivityIntervalRef.current) clearInterval(inactivityIntervalRef.current);
        };
    }, []);

    const handleAtClick = useCallback(() => {
        if (atFlying) {
            // Le @ est attrapé - arrêter le mouvement
            stopFlying();
        } else {
            // Repositionner le @
            moveAtRandom();
        }
    }, [atFlying, stopFlying, moveAtRandom]);

    const getGameMessage = () => {
        if (isEmailValid) {
            return "✅ Email valide ! Le @ est sécurisé.";
        }
        
        if (gameActive) {
            return "🎯 Attrapez le @ qui s'échappe ! Cliquez dessus pour le capturer.";
        }
        
        if (inactivityTime > 0) {
            return `⏳ Le @ s'échappera dans ${10 - inactivityTime}s si l'email n'est pas complété...`;
        }
        
        return "✍️ Commencez à taper votre email...";
    };

    return (
        <div className="email-escape-container" ref={containerRef}>
            <h1>Email Escape</h1>
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