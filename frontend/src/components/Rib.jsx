import React from 'react'
import { useTranslation } from '../context/LanguageContext'

const Rib = () => {
  const { t } = useTranslation();
    return (
        <>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p className='font-bold'>{t('rib.step1')}</p>
                    <p>{t('rib.sendTotal')}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p className='font-bold'>{t('rib.step2')}</p>
                    <p>{t('rib.sendCapture')}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p className='font-bold'>{t('rib.rib')}</p>
                    <p>{t('rib.ribAccount')}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p className='font-bold'>{t('rib.name')}</p>
                    <p>{t('rib.nameValue')}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p className='font-bold'>{t('rib.whatsapp')}</p>
                    <p>{t('rib.whatsappValue')}</p>
                </div>
            </div>
        </>
    )
}

export default Rib