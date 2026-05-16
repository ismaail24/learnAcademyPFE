import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OPTIONS = [
  {
    code: "en",
    flag: "🇬🇧",
    label: "English",
  },
  {
    code: "fr",
    flag: "🇫🇷",
    label: "Français",
  },
  {
    code: "ar",
    flag: "🇸🇦",
    label: "العربية",
  },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const current = OPTIONS.find((item) => item.code === lang) || OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Language"
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-all duration-200 outline-none"
      >
        <Languages size={18} />

        <span className="text-lg">{current.flag}</span>

        <span className="hidden sm:block text-sm font-medium">
          {current.label}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border border-border bg-background shadow-xl"
      >
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => setLang(option.code)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              lang === option.code
                ? "bg-primary/10 text-primary font-semibold"
                : "hover:bg-muted"
            }`}
          >
            <span className="text-lg">{option.flag}</span>

            <span>{option.label}</span>

            {lang === option.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
