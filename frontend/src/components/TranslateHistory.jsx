import { EditIcon } from "./icons/Edit";
import { DeleteIcon } from "./icons/Delete";
import SaveIcon from "./icons/Save";
import { useEffect, useRef, useState } from "react";
import { useTranslator } from "../stores/translate";

export const TranslateHistory = () => {
  const { setTranslations, translations } = useTranslator();
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [expandedLeft, setExpandedLeft] = useState({});
  const [expandedRight, setExpandedRight] = useState({});
  const [overflowLeft, setOverflowLeft] = useState({});
  const [overflowRight, setOverflowRight] = useState({});

  // refs por fila para medir overflow real del texto truncado
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  const setLeftRef = (id) => (el) => {
    if (el) leftRefs.current[id] = el;
  };
  const setRightRef = (id) => (el) => {
    if (el) rightRefs.current[id] = el;
  };

  const measureOverflow = () => {
    const ol = {};
    const or = {};
    Object.keys(leftRefs.current).forEach((id) => {
      const el = leftRefs.current[id];
      if (el) ol[id] = el.scrollWidth > el.clientWidth;
    });
    Object.keys(rightRefs.current).forEach((id) => {
      const el = rightRefs.current[id];
      if (el) or[id] = el.scrollWidth > el.clientWidth;
    });
    setOverflowLeft(ol);
    setOverflowRight(or);
  };

  const getTranslationHistory = async () => {
    const response = await fetch("http://localhost:4000/translations", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const { data } = await response.json();
    setTranslations(data);
  };

  useEffect(() => {
    getTranslationHistory();
  }, []);

  useEffect(() => {
    // medir cuando cambia la data
    measureOverflow();
  }, [translations]);

  useEffect(() => {
    const onResize = () => measureOverflow();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleEdit = (id) => {
    if (editingId === id) {
      handleSave(id);
      return;
    }
    const current = translations.find((t) => t.id === id);
    if (!current) return;
    setEditingId(id);
    setEditValue(current.source_text);
  };

  const handleSave = async (id) => {
    const current = translations.find((t) => t.id === id);
    if (!current) return;

    const updatedItem = { ...current, source_text: editValue };

    const updatedTranslations = translations.map((t) =>
      t.id === id ? updatedItem : t
    );
    setTranslations(updatedTranslations);
    setEditingId(null);
    setEditValue("");

    const response = await fetch(`http://localhost:4000/translations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_text: updatedItem.source_text,
        source_lang: updatedItem.source_lang,
        target_lang: updatedItem.target_lang,
      }),
    });
    const { data } = await response.json();

    const newTranslations = translations.map((translation) =>
      translation.id === data.id ? data : translation
    );
    setTranslations(newTranslations);
  };

  const toggleExpandLeft = (id) =>
    setExpandedLeft((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpandRight = (id) =>
    setExpandedRight((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <ul className="flex w-full mt-6 flex-col">
      <h3 className="px-10 text-xl mb-4">History</h3>

      {translations?.map((translation) => (
        <li
          key={translation.id}
          className="border-t py-4 flex relative items-center justify-between border-gray-700/20 bg-zinc-50 w-full shadow-md"
        >
          {/* Columna izquierda */}
          <div className="w-1/2 flex border-r-2 border-gray-800/60 px-8 h-full items-center gap-6">
            <span className="text-sm text-gray-900 px-2 py-1 bg-blue-200 border border-blue-300 rounded-sm">
              {translation.source_lang}
            </span>

            {editingId === translation.id ? (
              <input
                type="text"
                className="text-lg border border-gray-400 rounded px-2 py-1 w-full outline-none focus:ring-2 focus:ring-blue-400"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <div className="flex-1 min-w-0 flex items-center gap-2">
                {expandedLeft[translation.id] ? (
                  <>
                    <p className="text-lg whitespace-pre-wrap flex-1">
                      {translation.source_text}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleExpandLeft(translation.id)}
                      className="text-blue-600 text-sm hover:underline shrink-0"
                    >
                      Ver menos
                    </button>
                  </>
                ) : (
                  <>
                    <p
                      ref={setLeftRef(translation.id)}
                      className="text-lg truncate flex-1"
                    >
                      {translation.source_text}
                    </p>
                    {overflowLeft[translation.id] && (
                      <button
                        type="button"
                        onClick={() => toggleExpandLeft(translation.id)}
                        className="text-blue-600 text-sm hover:underline shrink-0"
                      >
                        Ver más
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Columna derecha: ocupa el espacio restante, sin solapar iconos */}
          <div className="flex-1 px-8 flex items-center gap-6 min-w-0">
            <span className="text-sm text-gray-900 px-2 py-1 bg-red-200 border border-red-300 rounded-sm">
              {translation.target_lang}
            </span>
            <div className="flex-1 min-w-0">
              {expandedRight[translation.id] ? (
                <>
                  <p className="text-lg whitespace-pre-wrap">
                    {translation.translated_text}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleExpandRight(translation.id)}
                    className="text-blue-600 text-sm hover:underline mt-1"
                  >
                    Ver menos
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 w-full min-w-0">
                  <p
                    ref={setRightRef(translation.id)}
                    className="text-lg truncate flex-1"
                  >
                    {translation.translated_text}
                  </p>
                  {overflowRight[translation.id] && (
                    <button
                      type="button"
                      onClick={() => toggleExpandRight(translation.id)}
                      className="text-blue-600 text-sm hover:underline shrink-0"
                    >
                      Ver más
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Iconos de acción (tamaño constante y columna fija) */}
          <div className="w-16 flex gap-2 items-center justify-end pr-4">
            <button
              className="p-2"
              onClick={() => handleEdit(translation.id)}
              title={editingId === translation.id ? "Guardar" : "Editar"}
              aria-label={editingId === translation.id ? "Guardar" : "Editar"}
            >
              {editingId === translation.id ? (
                <SaveIcon className="h-5 w-5 text-green-500 hover:text-green-600 cursor-pointer" />
              ) : (
                <EditIcon className="h-5 w-5 text-blue-400 hover:text-blue-500 cursor-pointer" />
              )}
            </button>
            <button
              className="p-2"
              onClick={() => handleDelete(translation.id)}
            >
              <DeleteIcon className="h-5 w-5 text-red-400 hover:text-red-500 cursor-pointer" />
            </button>
          </div>
        </li>
      ))}

      {translations?.length === 0 && (
        <p className="h-20 flex text-base justify-center items-center w-full">
          No Translation yet
        </p>
      )}
    </ul>
  );
};
