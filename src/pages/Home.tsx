import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiArrowRight, FiCpu, FiHeart, FiSearch, FiShield } from 'react-icons/fi';
import { MdCompareArrows } from 'react-icons/md';
import { heartDevices } from '../data/heartDevices';
import type { HeartDevice } from '../types/HeartDevice';
import DeviceSelector from '../components/DeviceSelector';
import HeartViewer from '../components/HeartViewer';
import InfoPanel from '../components/InfoPanel';
import ControlsPanel, { type ControlState } from '../components/ControlsPanel';
import SearchBar from '../components/SearchBar';
import Comparison from '../components/Comparison';
import Quiz from '../components/Quiz';
import LearningCard from '../components/LearningCard';

const learningTopics = [
  {
    title: 'Normal Heart Valve Anatomy',
    text: 'Healthy valves open and close to keep blood moving in one direction through the heart chambers.',
    accent: 'Blue',
  },
  {
    title: 'Valve Stenosis',
    text: 'Stenosis happens when a valve becomes stiff and narrow, making the heart work harder to pump blood.',
    accent: 'Indigo',
  },
  {
    title: 'Valve Regurgitation',
    text: 'Regurgitation is when a valve leaks and blood flows backward instead of forward.',
    accent: 'Pink',
  },
  {
    title: 'How Surgeons Implant Devices',
    text: 'Surgeons can use open surgery or catheter-based tools to place devices into the heart safely.',
    accent: 'Cyan',
  },
  {
    title: 'Future Technologies',
    text: 'Engineers are developing living valves that grow with patients and repair themselves.',
    accent: 'Violet',
  },
];

const quizQuestions = [
  {
    question: 'Which valve type usually requires lifelong blood thinners?',
    choices: ['Mechanical Valve', 'Bioprosthetic Valve', 'TAVR', 'Melody Valve'],
    answer: 'Mechanical Valve',
  },
  {
    question: 'Which device is delivered by catheter and expands inside the aorta?',
    choices: ['Mitral Ring', 'TAVR', 'Annuloplasty Ring', 'Bioprosthetic Valve'],
    answer: 'TAVR',
  },
  {
    question: 'Which implant preserves the patient\'s own valve tissue?',
    choices: ['Mechanical Valve', 'Edwards SAPIEN', 'Mitral Repair Ring', 'Melody Valve'],
    answer: 'Mitral Repair Ring',
  },
];

const experienceHighlights = [
  {
    title: 'Clinical storytelling',
    text: 'Learn why each implant exists and who it is designed to help.',
    icon: FiShield,
  },
  {
    title: 'Interactive exploration',
    text: 'Inspect device details with hotspots and responsive controls.',
    icon: FiActivity,
  },
  {
    title: 'Knowledge check',
    text: 'Reinforce your understanding with a quick quiz at the end.',
    icon: FiCpu,
  },
];

const Home = () => {
  const [deviceQuery, setDeviceQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<HeartDevice>(heartDevices[2]);
  const [comparisonPair, setComparisonPair] = useState<[HeartDevice, HeartDevice]>([heartDevices[0], heartDevices[2]]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [viewerControls, setViewerControls] = useState<ControlState>({ wireframe: false, crossSection: false, autoRotate: true, transparency: 0.4, background: 'slate' });

  const filteredDevices = useMemo(() => {
    const query = deviceQuery.toLowerCase();
    return heartDevices.filter((device) => device.name.toLowerCase().includes(query));
  }, [deviceQuery]);

  return (
    <div className="min-h-screen text-rose-950">
      <div className="mx-auto w-full max-w-none px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1.2fr)] xl:grid-cols-[320px_minmax(0,1.4fr)]">
          <aside className="lg:sticky lg:top-6 lg:self-start space-y-6 rounded-[32px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-5 shadow-glow backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-rose-700">Explore Devices</p>
                <h2 className="mt-2 text-2xl font-semibold text-rose-950">Heart Valve Library</h2>
              </div>
              <div className="rounded-2xl bg-rose-50/80 p-3 text-rose-700 shadow-sm">
                <FiHeart size={22} />
              </div>
            </div>
            <SearchBar value={deviceQuery} onChange={setDeviceQuery} />
            <DeviceSelector
              devices={filteredDevices}
              selectedDevice={selectedDevice}
              onSelect={setSelectedDevice}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-rose-200 bg-rose-50/80 p-5 shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-rose-700">Comparison</p>
                  <h3 className="mt-2 text-lg font-semibold text-rose-950">Quick Facts</h3>
                </div>
                <div className="rounded-2xl bg-rose-50/80 p-3 text-rose-700 shadow-sm">
                  <MdCompareArrows size={22} />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-rose-700">
                Pick any two devices to compare strengths, materials, and intended patients.
              </p>
              <div className="mt-5 grid gap-3">
                <button
                  onClick={() => setComparisonPair([selectedDevice, comparisonPair[1]])}
                  className="rounded-3xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-left text-sm text-rose-900 transition hover:border-rose-400/50 hover:bg-rose-100"
                >
                  Primary: {selectedDevice.name}
                </button>
                <button
                  onClick={() => setComparisonPair([comparisonPair[0], selectedDevice])}
                  className="rounded-3xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-left text-sm text-rose-900 transition hover:border-rose-400/50 hover:bg-rose-100"
                >
                  Secondary: {comparisonPair[1].name}
                </button>
              </div>
            </motion.div>
          </aside>

          <main className="space-y-8">
            <section className="overflow-hidden rounded-[40px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-6 shadow-2xl shadow-rose-200/50 backdrop-blur-xl sm:p-8 xl:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="space-y-4"
                  >
                    <p className="text-sm uppercase tracking-[0.35em] text-rose-700">Young Heart Innovators</p>
                    <h1 className="text-4xl font-semibold text-rose-950 sm:text-5xl">
                      Interactive Heart Valve Biomedical Device Explorer
                    </h1>
                    <p className="max-w-2xl text-lg leading-8 text-rose-700">
                      Explore how biomedical engineers repair damaged heart valves through modern medical devices.
                    </p>
                  </motion.div>
                  <div className="relative overflow-hidden rounded-[28px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-6 shadow-2xl shadow-rose-200/50">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(251,207,232,0.18),transparent_20%)]" />
                    <div className="relative grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                      <div className="rounded-[24px] border border-rose-200 bg-rose-50/80 p-5 shadow-inner shadow-rose-200/50">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-rose-700">What this experience offers</p>
                            <h3 className="mt-2 text-xl font-semibold text-rose-950">A guided tour through cardiac device innovation</h3>
                          </div>
                          <div className="rounded-2xl bg-rose-400/10 p-3 text-rose-700">
                            <FiCpu size={18} />
                          </div>
                        </div>
                        <div className="mt-5 grid gap-3">
                          {experienceHighlights.map((item) => {
                            const Icon = item.icon;
                            return (
                              <div key={item.title} className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4">
                                <div className="flex items-center gap-3">
                                  <div className="rounded-2xl bg-rose-50/80 p-2 text-rose-700">
                                    <Icon size={16} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-rose-950">{item.title}</p>
                                    <p className="mt-1 text-sm leading-6 text-rose-700">{item.text}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="rounded-[24px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-5 shadow-lg shadow-rose-200/50">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-rose-700">Now exploring</p>
                            <h3 className="mt-2 text-xl font-semibold text-rose-950">{selectedDevice.name}</h3>
                          </div>
                          <div className="rounded-2xl bg-rose-400/10 p-3 text-rose-700">
                            <FiHeart size={18} />
                          </div>
                        </div>
                        <div className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50/80 p-5">
                          <p className="text-sm leading-7 text-rose-700">{selectedDevice.description}</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-rose-50/80 p-4">
                              <p className="text-xs uppercase tracking-[0.25em] text-rose-500">Clinical purpose</p>
                              <p className="mt-2 text-sm text-rose-900">{selectedDevice.clinicalPurpose}</p>
                            </div>
                            <div className="rounded-2xl bg-rose-50/80 p-4">
                              <p className="text-xs uppercase tracking-[0.25em] text-rose-500">FDA approval</p>
                              <p className="mt-2 text-sm text-rose-900">{selectedDevice.fdaApproval}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-400/10 px-3 py-2 text-sm text-rose-900">
                          <FiArrowRight size={15} />
                          Tap the device cards to switch focus
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6">
                  <div className="rounded-[32px] border border-rose-200 bg-rose-50/80 p-6 shadow-glow backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.35em] text-rose-700">Featured Device</p>
                    <h2 className="mt-4 text-2xl font-semibold text-rose-950">{selectedDevice.name}</h2>
                    <p className="mt-3 text-sm leading-7 text-rose-700">{selectedDevice.description}</p>
                    <div className="mt-6 grid gap-3 text-sm text-rose-900">
                      <div className="rounded-3xl bg-rose-50/80 p-4">Clinical Purpose: {selectedDevice.clinicalPurpose}</div>
                      <div className="rounded-3xl bg-rose-50/80 p-4">FDA Year: {selectedDevice.fdaApproval}</div>
                    </div>
                  </div>
                  <div className="rounded-[32px] border border-rose-200 bg-rose-50/80 p-6 shadow-glow backdrop-blur-xl">
                    <h3 className="text-xl font-semibold text-rose-950">Learning Mode</h3>
                    <div className="mt-5 space-y-4">
                      {learningTopics.map((topic) => (
                        <LearningCard key={topic.title} title={topic.title} text={topic.text} accent={topic.accent} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[40px] border border-rose-200 bg-rose-50/80 p-5 shadow-2xl shadow-rose-200/50 backdrop-blur-xl">
                <HeartViewer
                  device={selectedDevice}
                  activeHotspot={activeHotspot}
                  onHotspotSelect={setActiveHotspot}
                  controls={viewerControls}
                />
                <ControlsPanel controls={viewerControls} onChange={setViewerControls} />
              </div>
              <InfoPanel device={selectedDevice} activeHotspot={activeHotspot} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Comparison devices={comparisonPair} />
              <Quiz questions={quizQuestions} />
            </section>

            <footer className="rounded-[40px] border border-rose-200 bg-rose-50/80 p-6 shadow-2xl shadow-rose-200/50 backdrop-blur-xl">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-rose-700">Final experience</p>
                  <h3 className="mt-2 text-2xl font-semibold text-rose-950">A polished educational experience for biomedical device exploration</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['Interactive learning', 'Clinical context', 'Device comparison'].map((label) => (
                    <span key={label} className="rounded-full border border-rose-200 bg-rose-50/80 px-4 py-2 text-sm text-rose-900">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
