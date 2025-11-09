import { EditIcon } from "./icons/Edit";
import { DeleteIcon } from "./icons/Delete";
import { useEffect, useState } from "react";
import { useTranslator } from "../stores/translate";

export const TranslateHistory = () => {
  const { setTranslations, translations } = useTranslator();
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

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

    const newTranslations = translations.map((translation) => {
      if (translation.id === data.id) {
        return data;
      }
      return translation;
    });

    setTranslations(newTranslations);
  };

  const handleDelete = async (id) => {
    const newTranslations = translations.filter((t) => t.id !== id);
    setTranslations(newTranslations);
    await fetch(`http://localhost:4000/translations/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <ul className="flex w-full mt-6 flex-col">
      <h3 className="px-10 text-xl mb-4">History</h3>

      {translations?.map((translation) => (
        <li
          key={translation.id}
          className="border-t py-4 flex relative items-center justify-between border-gray-700/20 bg-zinc-50 w-full shadow-md"
        >
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
              <h3
                id={`currentTraduction-${translation.id}`}
                className="text-lg truncate"
              >
                {translation.source_text}
              </h3>
            )}
          </div>

          <div className="w-1/2 px-8 flex items-center gap-6">
            <span className="text-sm text-gray-900 px-2 py-1 bg-red-200 border border-red-300 rounded-sm">
              {translation.target_lang}
            </span>
            <h3 className="text-lg truncate">{translation.translated_text}</h3>
          </div>

          <div className="absolute right-4 flex gap-2">
            <button className="p-2" onClick={() => handleEdit(translation.id)}>
              {editingId === translation.id ? (
                <span className="text-green-500 font-semibold">Save</span>
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
