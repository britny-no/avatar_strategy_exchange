import { useTypedSelector } from '../states/useTypedSelector';

type LanguageType = 'KOR' | 'ENG';


type ReturnType = {
    currentLanguage: LanguageType;
};

const useCurrentLanguage = (): ReturnType => {
    const currentLanguage = useTypedSelector((state) => state.userReducer.language);
    return { currentLanguage };
};

export default useCurrentLanguage;
