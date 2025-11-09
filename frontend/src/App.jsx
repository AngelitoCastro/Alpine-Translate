import { useEffect } from "react";
import { useDebounce } from "./UseDebounce";
import { Header } from "./components/Header";
import { TranslateIcon } from "./components/icons/Translate";
import { useTranslator } from "./stores/translate";
import { TranslateHistory } from "./components/TranslateHistory";

export const App = () => {
  const {
    translate,
    languageInput,
    translations,
    languageOutput,
    prompt,
    setTranslate,
    setPrompt,
    isLoading,
    setIsLoading,
    setTranslations,
  } = useTranslator();
  const finalPrompt = useDebounce(prompt, 900);

  const handleInput = (e) => {
    setPrompt(e.target.value);
  };

  useEffect(() => {
    if (!finalPrompt.trim()) return;
    fetchTranslation();
  }, [finalPrompt]);

  const fetchTranslation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_text: finalPrompt,
          source_lang: languageInput,
          target_lang: languageOutput,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.message || "Error al traducir");
      }

      const { data } = await response.json();
      // data ahora es el registro completo con id y translated_text
      setTranslate(data?.translated_text || "Sin resultado.");
      if (data) {
        setTranslations([...translations, data]);
      }
    } catch (error) {
      console.error(error);
      setTranslate("⚠️ No se pudo traducir, intenta otra vez.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col w-full  max-w-7xl mx-auto   font-sans text-gray-800 md:px-20 px-6">
      {/* HEADER */}
      <nav className="text-gray-700 flex items-center py-8 gap-6 text-2xl font-semibold">
        <TranslateIcon ClassName="w-12 h-12  " /> Alpine Translate
      </nav>

      <div className=" rounded-xl border-2 border-gray-800/60 mt-8  overflow-hidden">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2  ">
          <div className="flex flex-col  border-b-2  border-gray-800/60 p-6 transition-all duration-300 hover:shadow-md">
            <label className="text-gray-500 mb-3 text-sm font-semibold uppercase tracking-wide">
              Texto original
            </label>
            <textarea
              className="flex-1 w-full resize-none bg-transparent text-lg outline-none placeholder-gray-400 min-h-[260px] leading-relaxed"
              placeholder="Escribe algo para traducir..."
              onInput={handleInput}
              maxLength={500}
              value={prompt}
            />
            <div className="flex justify-end text-xs text-gray-400 mt-2">
              {prompt.length}/500
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col bg-linear-to-br border-b-2 border-l-2  border-gray-900/60 p-6 transition-all duration-300 hover:shadow-md">
            <label className="text-gray-500 mb-3 text-sm font-semibold uppercase tracking-wide">
              Traducción
            </label>
            <div className="flex-1 min-h-[260px] overflow-auto text-lg leading-relaxed relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-400 text-sm">
                      Traduciendo...
                    </span>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap transition-opacity duration-300">
                  {translate}
                </p>
              )}
            </div>
          </div>
        </div>
        <TranslateHistory />
      </div>
    </section>
  );
};
