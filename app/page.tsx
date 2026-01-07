'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import { db } from '@/lib/firebase';
import { getApp } from 'firebase/app';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { InstallButton } from '../src/components/install-button';
import { CountdownTimer } from '@/src/components/countdown-timer';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Home() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      console.log('Install prompt ready');
    };

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      console.log('App is running as standalone');
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log('App installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    setInstallPrompt(null);
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <main className="flex flex-col h-auto w-full p-6">
        <CountdownTimer targetUnixEpoch={1768046400} className='mx-7'/>
      </main>
      { /*installPrompt && !isInstalled && */(
        <InstallButton
          onClick={handleInstall}
          className="fixed bottom-0 left-0 right-0"
        >
        </InstallButton>
      )}
    </div>
  );
}
