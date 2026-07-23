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
const BIRTH_DATE = new Date("2011-01-19T00:00:00Z");

function getAgeFromBirthdate(birthDate: Date, now = new Date()) {
    const yearDiff = now.getUTCFullYear() - birthDate.getUTCFullYear();
    const monthDiff = now.getUTCMonth() - birthDate.getUTCMonth();
    const dayDiff = now.getUTCDate() - birthDate.getUTCDate();
    const hasBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
    return hasBirthdayPassed ? yearDiff : yearDiff - 1;
}

const translations = {
    en: {
        nav: {
            projects: "Projects",
            timeline: "Timeline",
            contact: "Contact",
            donate: "Support",
            backHome: "Back home",
        },
        home: {
            eyebrow: "Student engineer · open-source builder",
            subtitle:
                "Hardware, artificial intelligence, networking and aerospace ideas turned into open, documented projects.",
            primaryNavigation: "Primary navigation",
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
                "I'm a {age}-year-old Brazilian student engineer turning ambitious ideas into documented, open-source projects across ",
            paragraphOneAfterMit:
                ", computer architecture, embedded systems and artificial intelligence.",
            paragraphTwoBefore20t:
                "I build projects such as EEGFrontier, a ternary RISC-V core and AquaVision, and I founded ",
            paragraphTwoAfter20t:
                ", a student-led coding community focused on learning through real-world projects.",
            paragraphThreeBeforeShipwrecked:
                "My work is shaped by open-source collaboration, engineering experiments and communities such as ",
            paragraphThreeBetween:
                " and ",
            paragraphThreeAfterHackClub:
                ".",
            paragraphFour:
                "I care about reproducible work: clear documentation, measurable tests and projects that other people can study, build and improve.",
            paragraphFive:
                "I'm open to technical collaborations, research conversations and student-led engineering initiatives.",
            hackClubTitle: "Hack Club",
            hackClubSubtitle: "Building and learning with a global community of student makers.",
            timerTitle: "Time left until my College Application",
            location: "Brazil",
            selectedWork: "Selected work",
            aerospaceEngineering: "aerospace engineering",
            eegWork:
                "Open-source EEG hardware used by builders and researchers.",
            aquaWork:
                "A lightweight vision model for mapping floating marine waste.",
            ternaryWork:
                "Experiments extending a RISC-V core with ternary computing.",
            globeShow: "Show interactive globe",
            globeHide: "Hide interactive globe",
        },
        time: {
            days: "days",
            hoursShort: "h",
            minutesShort: "min",
            secondsShort: "s",
        },
        projects: {
            title: "Projects",
            eyebrow: "Selected builds, research and experiments",
            subtitle: "A curated view of my strongest open-source hardware, AI, networking and software work.",
            allProjects: "All Projects",
            browseSubtitle: "Search the selected public repositories or filter them by topic.",
            sectionNavigation: "Section navigation",
            featuredLabel: "Featured projects",
            eegDescription:
                "Open-source EEG hardware for measuring focus and attention, built so other makers and researchers can reproduce it.",
            aquaDescription:
                "A lightweight computer-vision model for detecting floating objects and marine debris on affordable edge hardware.",
            ternaryDescription:
                "A hardware research project extending the lowRISC Ibex core with native ternary computing experiments.",
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
            searchLabel: "Search repositories",
            searchPlaceholder: "Search by name, description or technology",
            allTopics: "All topics",
            noResults: "No repositories match these filters.",
            viewAllGithub: "View every repository on GitHub",
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
            twentyTDescription:
                "Student-run non-profit coding club focused on building real-world projects and learning technology. Think it. Hack it. Build it. Created by TheusHen.",
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
            loading: "Loading timeline…",
            error: "The timeline could not be loaded right now.",
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
            eyebrow: "Available for projects, collaboration and open-source work",
            title: "Contact",
            description:
                "Get in touch about software, hardware, aerospace ideas, research or building useful things on the internet.",
            linksLabel: "Contact links",
            updatesLabel: "Content and updates",
            github: "GitHub",
            email: "Email",
            instagram: "Instagram",
            linkedin: "LinkedIn",
            youtube: "YouTube",
            youtubeChannel: "YouTube channel",
            youtubeSubtitle: "Watch updates, projects, and new videos.",
            youtubeButton: "Access channel",
        },
        decisions: {
            bar: "Application journey",
            eyebrow: "College planning",
            title: "Building toward university",
            description:
                "A transparent countdown and a shortlist of universities whose engineering and research culture inspire my long-term goals. This is a planning page, not an admissions result.",
            countdown: "Time until my application milestone",
            shortlist: "Research shortlist",
            shortlistNote:
                "These institutions are research interests only; they do not represent applications, offers or affiliations.",
            mitFocus: "Aerospace, computation and open research",
            stanfordFocus: "Computer systems and interdisciplinary engineering",
            caltechFocus: "Small research community and aerospace science",
            princetonFocus: "Computer architecture and fundamental research",
            harvardFocus: "Cross-disciplinary science and engineering",
            yaleFocus: "Research, public service and broad learning",
            northwesternFocus: "Design, engineering and collaborative projects",
        },
        donate: {
            eyebrow: "Support independent projects",
            title: "Support my work",
            description:
                "If my open-source projects helped you, you can support future prototypes, components and public documentation.",
            copy: "Copy address",
            copied: "Address copied",
            openWallet: "Open wallet",
            notice: "Always verify the network and address before sending funds.",
            walletsLabel: "Wallet addresses",
        },
        footer: {
            description: "Open projects, documented experiments and continuous learning.",
            navigation: "Footer navigation",
            source: "Source code",
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
            donate: "Apoiar",
            backHome: "Voltar para o início",
        },
        home: {
            eyebrow: "Estudante de engenharia · construtor open source",
            subtitle:
                "Hardware, inteligência artificial, redes e ideias aeroespaciais transformadas em projetos abertos e documentados.",
            primaryNavigation: "Navegação principal",
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
                "Sou um estudante brasileiro de {age} anos que transforma ideias ambiciosas em projetos abertos e documentados nas áreas de ",
            paragraphOneAfterMit:
                ", arquitetura de computadores, sistemas embarcados e inteligência artificial.",
            paragraphTwoBefore20t:
                "Desenvolvo projetos como EEGFrontier, um núcleo RISC-V ternário e AquaVision, além de ter fundado a ",
            paragraphTwoAfter20t:
                ", uma comunidade de programação liderada por estudantes e focada em aprender construindo projetos reais.",
            paragraphThreeBeforeShipwrecked:
                "Meu trabalho é guiado por colaboração open source, experimentos de engenharia e comunidades como ",
            paragraphThreeBetween:
                " e ",
            paragraphThreeAfterHackClub:
                ".",
            paragraphFour:
                "Valorizo trabalho reproduzível: documentação clara, testes mensuráveis e projetos que outras pessoas possam estudar, construir e melhorar.",
            paragraphFive:
                "Estou aberto a colaborações técnicas, conversas sobre pesquisa e iniciativas de engenharia lideradas por estudantes.",
            hackClubTitle: "Hack Club",
            hackClubSubtitle: "Construindo e aprendendo com uma comunidade global de estudantes makers.",
            timerTitle: "Tempo restante até minha aplicação universitária",
            location: "Brasil",
            selectedWork: "Trabalhos selecionados",
            aerospaceEngineering: "engenharia aeroespacial",
            eegWork:
                "Hardware EEG aberto usado por estudantes, makers e pesquisadores.",
            aquaWork:
                "Um modelo leve de visão para mapear resíduos marinhos flutuantes.",
            ternaryWork:
                "Experimentos estendendo um núcleo RISC-V com computação ternária.",
            globeShow: "Mostrar globo interativo",
            globeHide: "Ocultar globo interativo",
        },
        time: {
            days: "dias",
            hoursShort: "h",
            minutesShort: "min",
            secondsShort: "s",
        },
        projects: {
            title: "Projetos",
            eyebrow: "Projetos, pesquisas e experimentos selecionados",
            subtitle: "Uma seleção dos meus melhores trabalhos em hardware aberto, IA, redes e software.",
            allProjects: "Todos os projetos",
            browseSubtitle: "Pesquise nos repositórios selecionados ou filtre por tópico.",
            sectionNavigation: "Navegação da seção",
            featuredLabel: "Projetos em destaque",
            eegDescription:
                "Hardware EEG aberto para medir foco e atenção, construído para ser reproduzido por outros makers e pesquisadores.",
            aquaDescription:
                "Um modelo leve de visão computacional para detectar objetos flutuantes e resíduos marinhos em hardware acessível.",
            ternaryDescription:
                "Um projeto de pesquisa em hardware que estende o núcleo lowRISC Ibex com experimentos de computação ternária.",
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
            searchLabel: "Pesquisar repositórios",
            searchPlaceholder: "Pesquise por nome, descrição ou tecnologia",
            allTopics: "Todos os tópicos",
            noResults: "Nenhum repositório corresponde a esses filtros.",
            viewAllGithub: "Ver todos os repositórios no GitHub",
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
            twentyTDescription:
                "Clube de programação sem fins lucrativos gerido por estudantes e focado em construir projetos reais e aprender tecnologia. Think it. Hack it. Build it. Created by TheusHen.",
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
            loading: "Carregando linha do tempo…",
            error: "Não foi possível carregar a linha do tempo agora.",
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
            eyebrow: "Disponível para projetos, colaborações e open source",
            title: "Contato",
            description:
                "Entre em contato para conversar sobre software, hardware, ideias aeroespaciais, pesquisa ou projetos úteis para a internet.",
            linksLabel: "Links de contato",
            updatesLabel: "Conteúdo e atualizações",
            github: "GitHub",
            email: "E-mail",
            instagram: "Instagram",
            linkedin: "LinkedIn",
            youtube: "YouTube",
            youtubeChannel: "Canal no YouTube",
            youtubeSubtitle: "Acompanhe atualizações, projetos e novos vídeos.",
            youtubeButton: "Acessar o canal",
        },
        decisions: {
            bar: "Jornada de aplicação",
            eyebrow: "Planejamento universitário",
            title: "Construindo meu caminho até a universidade",
            description:
                "Uma contagem regressiva transparente e uma lista de universidades cuja cultura de engenharia e pesquisa inspira meus objetivos. Esta é uma página de planejamento, não um resultado de admissão.",
            countdown: "Tempo até o marco da minha aplicação",
            shortlist: "Lista de pesquisa",
            shortlistNote:
                "Estas instituições são apenas interesses de pesquisa; não representam inscrições, ofertas ou vínculos.",
            mitFocus: "Aeroespacial, computação e pesquisa aberta",
            stanfordFocus: "Sistemas computacionais e engenharia interdisciplinar",
            caltechFocus: "Comunidade pequena de pesquisa e ciência aeroespacial",
            princetonFocus: "Arquitetura de computadores e pesquisa fundamental",
            harvardFocus: "Ciência e engenharia interdisciplinares",
            yaleFocus: "Pesquisa, serviço público e formação ampla",
            northwesternFocus: "Design, engenharia e projetos colaborativos",
        },
        donate: {
            eyebrow: "Apoie projetos independentes",
            title: "Apoie meu trabalho",
            description:
                "Se algum projeto aberto foi útil para você, é possível apoiar futuros protótipos, componentes e documentação pública.",
            copy: "Copiar endereço",
            copied: "Endereço copiado",
            openWallet: "Abrir carteira",
            notice: "Sempre confirme a rede e o endereço antes de enviar fundos.",
            walletsLabel: "Endereços das carteiras",
        },
        footer: {
            description: "Projetos abertos, experimentos documentados e aprendizado contínuo.",
            navigation: "Navegação do rodapé",
            source: "Código-fonte",
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
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
            const detectedLanguage =
                stored === "en" || stored === "pt"
                    ? stored
                    : window.navigator.language.toLowerCase().startsWith("pt")
                      ? "pt"
                      : "en";
            setLanguage(detectedLanguage);
            setReady(true);
        }, 0);

        return () => window.clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (!ready) return;
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }, [language, ready]);

    useEffect(() => {
        document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    }, [language]);

    const t = useCallback(
        (key: string, values?: TranslationValues) => {
            const current = getTranslationValue(language, key);
            const fallback = getTranslationValue("en", key);
            const message = typeof current === "string" ? current : typeof fallback === "string" ? fallback : key;
            const mergedValues = { age: getAgeFromBirthdate(BIRTH_DATE), ...values };
            return interpolate(message, mergedValues);
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
