import { useTranslator } from '../stores/translate'
import { ShufleIcon } from './icons/Shufle'
export const Header = () => {

    const {languageOutput,languageInput, setLanguageInput,setLanguageOutput, setTranslate, setPrompt} = useTranslator()

    const  swapLanguages = () => {
        setLanguageInput(languageOutput)
        setLanguageOutput(languageInput)
        setTranslate('')
        setPrompt('')
    }


    return (
         <header className='flex justify-between relative items-center rounded-t-xl p-5 shadow-md shadow-gray-200/60 border-b-2  border-gray-800/60 bg-linear-to-r via-transparent to-red-200 from-blue-200 transition-all duration-300  '>
        <span className='px-4 py-2   text-gray-800 rounded-xl font-medium backdrop-blur-sm   transition-all duration-300'>
          {languageInput}
        </span>

        <button
          onClick={swapLanguages}
          className='p-3 rounded-full absolute left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2  transition-all duration-200'
          title='Intercambiar idiomas'
        >
          <ShufleIcon className='w-5 h-5 text-gray-700 transition-transform duration-300 hover:rotate-180' />
        </button>

        <span className='px-4 py-2   text-gray-700 rounded-xl font-medium backdrop-blur-sm hover:shadow-sm transition-all duration-300'>
          {languageOutput}
        </span>
      </header>
    )
}
