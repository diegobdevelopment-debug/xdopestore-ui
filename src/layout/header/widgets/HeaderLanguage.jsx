"use client";
import i18next from "i18next";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

const HeaderLanguage = () => {
  const { i18n } = useTranslation("common");

  // Only keep Spanish and English in the dropdown
  const languages = useMemo(
    () => [
    {id: 1, title: "Spanish", icon: "es", image: "es"},
    {id: 2, title: "English", icon: "en", image: "us"},
    ],
    []
  );

  // Normalize current language code "en-US" -> "en", "es, CO" -> "es"
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "es").slice(0, 2);

  // UI state for the dropdown and selected language option
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    // Pick the current language from the list
    const defaultLanguage = languages.find((data) => data.icon == currentLanguage) ?? languages[0];
    setSelectedLang(defaultLanguage);
  }, []);
  const router = useRouter();
  // To change Language
  const handleChangeLang = (value) => {
    // Update UI
    setSelectedLang(value);
    i18next.changeLanguage(value.icon);
    // Refresh the page with the selected language
    router.refresh();
  };
  return (
    <Dropdown className="theme-form-select" isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret color="transparent" className="select-dropdown" type="button" id="select-language">
        {selectedLang?.image && <div  className={`iti-flag ${selectedLang.image}`}  />}
        <span>{selectedLang?.title}</span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        {languages.map((elem, i) => {
          if (elem.icon === currentLanguage) {
            return null;
          }
          return (
            <a onClick={() => handleChangeLang(elem)} key={i}>
              <DropdownItem id={elem.title}>
                {elem?.image && <div className={`iti-flag ${elem?.image}`} />}
                <span>{elem.title}</span>
              </DropdownItem>
            </a>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default HeaderLanguage;
