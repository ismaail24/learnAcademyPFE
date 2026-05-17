import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OPTIONS = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const normalizedLang = (lang || "").toLowerCase().trim();

  const current =
    OPTIONS.find((o) => o.code === normalizedLang) || OPTIONS[0];

  const handleChange = (code) => {
    setLang(code.toLowerCase());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Language switcher"
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-all outline-none"
      >
        <Languages size={18} />

        {/* Affiche seulement le drapeau */}
        <span className="text-lg leading-none">
          {current.flag}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[10rem] rounded-xl"
      >
        {OPTIONS.map((o) => {
          const isActive = normalizedLang === o.code;

          return (
            <DropdownMenuItem
              key={o.code}
              onSelect={() => handleChange(o.code)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-lg">
                {o.flag}
              </span>

              <span>{o.label}</span>

              {isActive && (
                <span className="ml-auto text-primary">
                  ✓
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}