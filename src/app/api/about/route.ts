// Tipagem para repositórios do GitHub
interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    owner: { avatar_url: string };
    fork: boolean;
    homepage?: string | null;
    topics?: string[];
}

const BIRTH_DATE = new Date("2011-01-19T00:00:00Z");

function getAgeFromBirthdate(birthDate: Date, now = new Date()) {
    const yearDiff = now.getUTCFullYear() - birthDate.getUTCFullYear();
    const monthDiff = now.getUTCMonth() - birthDate.getUTCMonth();
    const dayDiff = now.getUTCDate() - birthDate.getUTCDate();
    const hasBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
    return hasBirthdayPassed ? yearDiff : yearDiff - 1;
}

// Informações estáticas do About
const aboutInfo = {
    profile: {
        name: "TheusHen",
        age: getAgeFromBirthdate(BIRTH_DATE),
        photo: "https://avatars.githubusercontent.com/u/180109164",
        flag: "https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg",
        bio: [
            `${getAgeFromBirthdate(BIRTH_DATE)}-year-old student dreaming big and building the future with code. I’m determined to get into MIT with a full-ride scholarship, where I plan to major in Aerospace Engineering and Computer Engineering.`,
            "Founder of PRACTA, an open source community that helps students achieve their academic and personal goals with lots of code, collaboration, and resilience.",
            "I’ve already developed projects such as viral mutation simulators, digital organizers, and remote diagnosis systems, and I actively participate in hackathons like Shipwrecked and events from Hack Club.",
            "I’m always looking to learn new technologies, contribute to open source repositories, and grow as a developer and as a person.",
            "If you want to chat about programming, science, communities, or how to turn dreams into projects, reach out to me!",
        ],
        socials: [
            { label: "GitHub", url: "https://github.com/TheusHen" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/matheus-henrique-741776367/" },
            { label: "Email", url: "mailto:dev@theushen.me" },
            { label: "Instagram", url: "https://www.instagram.com/mmatheus_henriquee" },
            { label: "Reddit", url: "https://www.reddit.com/user/TheusHen" },
        ],
        hackclub: {
            image: "https://images.fillout.com/orgid-81/flowpublicid-eLhFehpKG6us/widgetid-cbsLd1W9tHmPW9frkYFap2/3G6y1B7Rk3agk6YVqtLmJN/Group-106.png?a=hcRnPh87k73TcrVHzBe6UW",
            name: "Hack Club",
            description: "I’m currently participating in Hack Club events and hackathons like Shipwrecked.",
        },
        college_app_countdown: {
            until: "2027-11-01T00:00:00Z"
        }
    },
    contact: [
        {
            icon: "github",
            label: "TheusHen",
            subtitle: "Github",
            url: "https://github.com/TheusHen"
        },
        {
            icon: "email",
            label: "dev@theushen.me",
            subtitle: "Email",
            url: "mailto:dev@theushen.me"
        },
        {
            icon: "instagram",
            label: "@mmatheus_henriquee",
            subtitle: "Instagram",
            url: "https://www.instagram.com/mmatheus_henriquee"
        },
        {
            icon: "linkedin",
            label: "Matheus Henrique",
            subtitle: "LinkedIn",
            url: "https://www.linkedin.com/in/matheus-henrique-741776367/"
        },
    ],
    featuredProjects: [
        {
            name: "PRACTA",
            description: "PRACTA is an open-source community focused on helping students prepare for admission to MIT. It provides a platform for students worldwide to discuss study strategies, share experiences, and connect with like-minded individuals.",
            url: "https://PRACTA.tech",
            image: "https://PRACTA-tech.vercel.app/Logo.png",
            type: ["openSource", "website"]
        },
        {
            name: "Arcade Lunar",
            description: "Arcade Lunar is a social network focused on gaming and multiplayer experiences. It connects players worldwide, offering communities, events, and interactive features.",
            url: "https://arcadelunar.com.br",
            image: "https://avatars.githubusercontent.com/u/174283552",
            type: ["closeSource", "application"]
        },
        {
            name: "Optifyx",
            description: "Optifyx is an app that allows a smartphone to fully monitor a desktop in real-time over a Wi-Fi connection. It provides seamless remote access, ensuring control and visibility.",
            url: "https://optifyx.live",
            image: "/optifyx.png",
            type: ["openSource", "application"]
        }
    ]
};

// Função para buscar projetos do GitHub dinamicamente
async function fetchGitHubProjects(username: string): Promise<GitHubRepo[]> {
    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
            headers: {
                Accept: 'application/vnd.github+json',
            },
            cache: 'no-store',
        });
        if (!res.ok) return [];
        const repos = await res.json();
        if (!Array.isArray(repos)) return [];
        return repos.map((repo: Record<string, unknown>) => ({
            id: repo.id as number,
            name: repo.name as string,
            description: repo.description as string,
            html_url: repo.html_url as string,
            stargazers_count: repo.stargazers_count as number,
            language: repo.language as string | null,
            owner: { avatar_url: (repo.owner as { avatar_url: string }).avatar_url },
            fork: repo.fork as boolean,
            homepage: repo.homepage ? (repo.homepage as string) : null,
            topics: (repo.topics ?? []) as string[],
        }));
    } catch {
        return [];
    }
}

// Handler para o endpoint /api/about
export async function GET() {
    const githubProjects = await fetchGitHubProjects("TheusHen");
    return new Response(
        JSON.stringify({
            ...aboutInfo,
            githubProjects,
        }),
        {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        }
    );
}
