"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "pt";

type TranslationValues = Record<string, string | number>;

type I18nContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, values?: TranslationValues) => string;
};

const LANGUAGE_STORAGE_KEY = "theushen-language";

const translations = {
    en: {
        nav: {
            projects: "Projects",
            timeline: "Timeline",
            contact: "Contact",
            backHome: "Back home",
        },
        home: {
            stars: "Stars",
            support: "Support my portfolio",
            loading: "Loading...",
            needHelp: "Need some help?",
            sendMessage: "Send message",
            scrollDown: "Scroll down for",
            aboutMe: "About Me",
        },
        about: {
            titlePrefix: "Hello, I'm ",
            paragraphOneBeforeMit:
                "14-year-old student dreaming big and building the future with code. I'm determined to get into ",
            paragraphOneAfterMit:
                " with a full-ride scholarship, where I plan to major in Aerospace Engineering and Computer Engineering.",
            paragraphTwoBeforePracta:
                "Founder of ",
            paragraphTwoAfterPracta:
                ", an open source community that helps students achieve their academic and personal goals with lots of code, collaboration, and resilience.",
            paragraphThreeBeforeShipwrecked:
                "I've already developed projects such as viral mutation simulators, digital organizers, and remote diagnosis systems, and I actively participate in hackathons like ",
            paragraphThreeBetween:
                " and events from ",
            paragraphThreeAfterHackClub:
                ".",
            paragraphFour:
                "I'm always looking to learn new technologies, contribute to open source repositories, and grow as a developer and as a person.",
            paragraphFive:
                "If you want to chat about programming, science, communities, or how to turn dreams into projects, reach out to me!",
            hackClubTitle: "Hack Club",
            hackClubSubtitle: "I'm currently participating in!",
            timerTitle: "Time left until my College Application",
        },
        time: {
            days: "days",
            hoursShort: "h",
            minutesShort: "min",
            secondsShort: "s",
        },
        projects: {
            title: "Projects",
            subtitle: "Some of the projects are from work and some are on my own time.",
            allProjects: "All Projects",
            filters: "Filters",
            filterTitle: "Filters",
            featuredType: "Featured Project Type",
            openSource: "Open Source",
            closeSource: "Closed Source",
            website: "Website",
            application: "Application",
            filtersNote: "* Filters above affect only the featured projects.",
            topics: "Topics",
            clear: "Clear",
            previousTopics: "Previous topics page",
            nextTopics: "Next topics page",
            clearAll: "Clear All",
            cancel: "Cancel",
            applyFilters: "Apply Filters",
            readMore: "Read more",
            githubProjects: "GitHub Projects",
            loadingRepositories: "Loading repositories…",
            errorRepositories: "Error fetching repositories.",
            projectWebsite: "Project Website",
            noDescription: "No description",
            other: "Other",
            viewOnGithub: "View {name} on GitHub",
            githubGists: "GitHub Gists",
            loadingGists: "Loading gists…",
            errorGists: "Error fetching gists.",
            noGists: "No gists found.",
            untitled: "Untitled",
            moreFiles: "+{count} more {fileLabel}",
            fileSingular: "file",
            filePlural: "files",
            textLanguage: "Text",
            practaDescription:
                "PRACTA is an open-source community focused on helping students prepare for SAT with focus in the MIT university. It provides a platform for students worldwide to discuss study strategies, share experiences, and connect with like-minded individuals.",
            arcadeDescription:
                "Arcade Lunar is a social network focused on gaming and multiplayer experiences. It connects players worldwide, offering communities, events, and interactive features.",
            optifyxDescription:
                "Optifyx is an app that allows a smartphone to fully monitor a desktop in real-time over a Wi-Fi connection. It provides seamless remote access, ensuring control and visibility.",
        },
        timeline: {
            title: "Timeline",
            subtitle: "Scroll down to see the timeline. Each point opens the full markdown entry on GitHub.",
            openOnGithub: "Open {title} on GitHub",
            cardHint: "Click to open the full entry on GitHub.",
            emptyState:
                "No markdown files found in /{folder}. Add files like 2026-01-05.md with a first line heading: '# Title'.",
        },
        errors: {
            title: "Oops!",
            subtitle: "Something went wrong",
            fallback: "An unexpected error occurred. Please try again.",
            tryAgain: "Try Again",
        },
        notFound: {
            title: "Page Not Found",
            body: "Sorry, the page you're looking for doesn't exist or has been moved.",
            backHome: "Back to Home",
        },
        contact: {
            github: "GitHub",
            email: "Email",
            instagram: "Instagram",
            linkedin: "LinkedIn",
        },
        accessibility: {
            accessibilityLabel: "Accessibility",
            translationLabel: "Translation",
            accessibilityTitle: "Accessibility settings",
            languageTitle: "Language",
            languageNotice:
                "Some project descriptions, repo topics, and GitHub content may remain in English or Portuguese because they are dynamic.",
            languageEnglish: "English",
            languagePortuguese: "Português",
            highContrast: "High contrast",
            textSize: "Text size",
            textSizeNormal: "Normal",
            textSizeLarge: "Large",
            textSizeXL: "Extra large",
            reduceMotion: "Reduce motion",
        },
    },
    pt: {
        nav: {
            projects: "Projetos",
            timeline: "Linha do tempo",
            contact: "Contato",
            backHome: "Voltar para o início",
        },
        home: {
            stars: "Estrelas",
            support: "Apoie meu portfólio",
            loading: "Carregando...",
            needHelp: "Precisa de ajuda?",
            sendMessage: "Enviar mensagem",
            scrollDown: "Role para ver",
            aboutMe: "Sobre mim",
        },
        about: {
            titlePrefix: "Olá, eu sou o ",
            paragraphOneBeforeMit:
                "Estudante de 14 anos sonhando alto e construindo o futuro com código. Estou determinado a entrar no ",
            paragraphOneAfterMit:
                " com bolsa integral, onde planejo cursar Engenharia Aeroespacial e Engenharia da Computação.",
            paragraphTwoBeforePracta:
                "Fundador da ",
            paragraphTwoAfterPracta:
                ", uma comunidade open source que ajuda estudantes a alcançar objetivos acadêmicos e pessoais com muito código, colaboração e resiliência.",
            paragraphThreeBeforeShipwrecked:
                "Já desenvolvi projetos como simuladores de mutação viral, organizadores digitais e sistemas de diagnóstico remoto, e participo ativamente de hackathons como ",
            paragraphThreeBetween:
                " e eventos do ",
            paragraphThreeAfterHackClub:
                ".",
            paragraphFour:
                "Estou sempre buscando aprender novas tecnologias, contribuir com repositórios open source e crescer como desenvolvedor e como pessoa.",
            paragraphFive:
                "Se você quiser conversar sobre programação, ciência, comunidades ou como transformar sonhos em projetos, fale comigo!",
            hackClubTitle: "Hack Club",
            hackClubSubtitle: "Estou participando atualmente!",
            timerTitle: "Tempo restante até minha aplicação universitária",
        },
        time: {
            days: "dias",
            hoursShort: "h",
            minutesShort: "min",
            secondsShort: "s",
        },
        projects: {
            title: "Projetos",
            subtitle: "Alguns dos projetos são do trabalho e outros são pessoais.",
            allProjects: "Todos os projetos",
            filters: "Filtros",
            filterTitle: "Filtros",
            featuredType: "Tipo de projeto em destaque",
            openSource: "Código aberto",
            closeSource: "Código fechado",
            website: "Website",
            application: "Aplicação",
            filtersNote: "* Os filtros acima afetam apenas os projetos em destaque.",
            topics: "Tópicos",
            clear: "Limpar",
            previousTopics: "Página anterior de tópicos",
            nextTopics: "Próxima página de tópicos",
            clearAll: "Limpar tudo",
            cancel: "Cancelar",
            applyFilters: "Aplicar filtros",
            readMore: "Saiba mais",
            githubProjects: "Projetos do GitHub",
            loadingRepositories: "Carregando repositórios…",
            errorRepositories: "Erro ao buscar repositórios.",
            projectWebsite: "Website do projeto",
            noDescription: "Sem descrição",
            other: "Outro",
            viewOnGithub: "Ver {name} no GitHub",
            githubGists: "Gists do GitHub",
            loadingGists: "Carregando gists…",
            errorGists: "Erro ao buscar gists.",
            noGists: "Nenhum gist encontrado.",
            untitled: "Sem título",
            moreFiles: "+{count} {fileLabel} a mais",
            fileSingular: "arquivo",
            filePlural: "arquivos",
            textLanguage: "Texto",
            practaDescription:
                "A PRACTA é uma comunidade open source focada em ajudar estudantes a se prepararem para o SAT com foco no MIT. Ela oferece uma plataforma para estudantes do mundo todo discutirem estratégias de estudo, compartilharem experiências e se conectarem com pessoas parecidas.",
            arcadeDescription:
                "Arcade Lunar é uma rede social voltada para games e experiências multiplayer. Ela conecta jogadores do mundo todo, oferecendo comunidades, eventos e recursos interativos.",
            optifyxDescription:
                "Optifyx é um app que permite que um smartphone monitore totalmente um desktop em tempo real via Wi-Fi. Ele oferece acesso remoto contínuo, garantindo controle e visibilidade.",
        },
        timeline: {
            title: "Linha do tempo",
            subtitle:
                "Role para ver a linha do tempo. Cada ponto abre a entrada completa em Markdown no GitHub.",
            openOnGithub: "Abrir {title} no GitHub",
            cardHint: "Clique para abrir a entrada completa no GitHub.",
            emptyState:
                "Nenhum arquivo Markdown encontrado em /{folder}. Adicione arquivos como 2026-01-05.md com a primeira linha sendo: '# Título'.",
        },
        errors: {
            title: "Ops!",
            subtitle: "Algo deu errado",
            fallback: "Ocorreu um erro inesperado. Tente novamente.",
            tryAgain: "Tentar novamente",
        },
        notFound: {
            title: "Página não encontrada",
            body: "Desculpe, a página que você procura não existe ou foi movida.",
            backHome: "Voltar para o início",
        },
        contact: {
            github: "GitHub",
            email: "E-mail",
            instagram: "Instagram",
            linkedin: "LinkedIn",
        },
        accessibility: {
            accessibilityLabel: "Acessibilidade",
            translationLabel: "Tradução",
            accessibilityTitle: "Configurações de acessibilidade",
            languageTitle: "Idioma",
            languageNotice:
                "Algumas descrições de projetos, tópicos de repositórios e conteúdos do GitHub podem permanecer em inglês ou português por serem dinâmicos.",
            languageEnglish: "Inglês",
            languagePortuguese: "Português",
            highContrast: "Alto contraste",
            textSize: "Tamanho do texto",
            textSizeNormal: "Normal",
            textSizeLarge: "Grande",
            textSizeXL: "Extra grande",
            reduceMotion: "Reduzir movimento",
        },
    },
} as const;

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function getTranslationValue(language: Language, key: string) {
    let current: unknown = translations[language] as Record<string, unknown>;

    for (const part of key.split(".")) {
        if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
            current = (current as Record<string, unknown>)[part];
        } else {
            return undefined;
        }
    }

    return current;
}

function interpolate(message: string, values?: TranslationValues) {
    if (!values) return message;
    return message.replace(/\{(\w+)\}/g, (_, valueKey) => {
        const replacement = values[valueKey];
        return replacement !== undefined ? String(replacement) : "";
    });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === "en" || stored === "pt") {
            setLanguage(stored);
            return;
        }
        const browserLang = window.navigator.language.toLowerCase();
        if (browserLang.startsWith("pt")) {
            setLanguage("pt");
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    }, [language]);

    const t = useCallback(
        (key: string, values?: TranslationValues) => {
            const current = getTranslationValue(language, key);
            const fallback = getTranslationValue("en", key);
            const message = typeof current === "string" ? current : typeof fallback === "string" ? fallback : key;
            return interpolate(message, values);
        },
        [language]
    );

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t,
        }),
        [language, setLanguage, t]
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
}
