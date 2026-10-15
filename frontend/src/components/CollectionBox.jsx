import { useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { useTranslation } from "../context/LanguageContext";

const CollectionBox = () => {
  const { t } = useTranslation();
  const [currentText, setCurrentText] = useState(t('collectionBox.men'));
  const texts = [t('collectionBox.men'), t('collectionBox.women'), t('collectionBox.kids')];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => {
        const i = texts.indexOf(prev);
        return texts[(i + 1) % texts.length];
      });
    }, 3000); // 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row border bg-black border-gray-400">
      {/* Left side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-white text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-white"></p>
            <p className="font-medium text-sm md:text-base">{t('collectionBox.collection')}</p>
          </div>

          <h1
            key={currentText} // important bach CSS animation t3awd
            className="prata-regular  text-3xl sm:py-3 lg:text-5xl leading-relaxed"
          >
            {currentText}
            <br />
            COLLECTION
          </h1>

          <div className="flex items-center justify-center gap-2">
            <p className="font-semibold text-sm md:text-base">{t('collectionBox.shopNow')}</p>
            <p className="w-8 md:w-11 h-[1px] bg-white"></p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <img className="w-full sm:w-1/2" src={assets.gif} alt="" />
    </div>
  );
};

export default CollectionBox;
