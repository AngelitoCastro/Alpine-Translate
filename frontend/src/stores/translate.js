import { create } from 'zustand'


export const useTranslator = create((set) => ({
    translate: '',
    prompt: '',
    languageInput: 'Español',
    languageOutput: 'Inglés',
    isLoading: false,
    translations: [],
    setTranslate: (translate) => set({ translate }),
    setPrompt: (prompt) => set({ prompt }),
    setLanguageInput: (languageInput) => set({ languageInput }),
    setLanguageOutput: (languageOutput) => set({ languageOutput }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setTranslations: (translations) => set({translations})
}))
