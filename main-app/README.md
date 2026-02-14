# ECO - Energy Costs Observer ⚡

ECO ist eine moderne Webanwendung zur Erfassung, Analyse und Prognose des häuslichen Energieverbrauchs (Strom). Das Ziel der Anwendung ist es, Nutzern durch detaillierte Visualisierungen und Kosten-Vorausberechnungen einen Überblick über ihren Stromverbrauch zu geben.

Die Anwendung wurde als **Single Page Application (SPA)** mit **React 19** entwickelt und kommuniziert mit einem **Spring Boot Backend**.

## 🚀 Features

*   **Benutzerverwaltung:** Sichere Authentifizierung via JWT (JSON Web Tokens) mit automatischem Session-Refresh.
*   **Rollenbasiertes System:** Unterscheidung zwischen Standard-Usern (Verbrauchserfassung) und Administratoren (User-Management).
*   **Tracking:** Erfassung von Zählerständen und automatische Berechnung des Verbrauchs.
*   **Visualisierung:** Interaktive Diagramme zur Darstellung von Verbrauchsverläufen und Kostentrends.
*   **Kostenüberblick:** Algorithmen zur Vorausberechnung der erwarteten Jahreskosten basierend auf dem aktuellen Nutzungsverhalten.
*   **Responsive Design:** Optimiert für Desktop, Tablet und Smartphone.

## 🛠 Tech Stack

Dieses Projekt setzt auf moderne Web-Standards und eine typsichere Entwicklungsumgebung.

*   **Frontend Framework:** React 19 | Library für User Interfaces |
*   **Sprache:** TypeScript | Statisch typisiertes JavaScript |
*   **Build Tool:** Vite | Schnelles Tooling für moderne Web-Projekte |
*   **Styling:** SCSS (Modules) | Präprozessor für modulares CSS |
*   **State Management:** Context API | Verwaltung globaler Zustände |
*   **HTTP Client:** Axios | Promise-basierter HTTP-Client |
*   **Routing:** React Router 6+ | Client-side Routing |
*   **Backend:** Java 21 / Spring Boot | REST API & Business Logic (separates Repo) 