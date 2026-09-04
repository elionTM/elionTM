import React from 'react';
import { ArrowLeft, ArrowRight, Check, Clock3, GraduationCap, Laptop, Rocket, Users } from 'lucide-react';
import { getAcademyCourse } from '../data/academyCourses';

const AcademyCourse = ({ slug }) => {
  const course = getAcademyCourse(slug);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] px-6 text-white">
        <div className="text-center"><p className="eyebrow text-cyan-400">Academy</p><h1 className="mt-4 text-5xl font-black tracking-tight">We couldn’t find that course.</h1><button onClick={() => navigateTo('/academy')} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950">Back to Academy <ArrowRight className="h-4 w-4" /></button></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020617] font-sans text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <button onClick={() => navigateTo('/academy')} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-colors hover:text-cyan-400"><ArrowLeft className="h-4 w-4" /> Back to Academy</button>
          <button onClick={() => navigateTo('/')} className="hidden items-center gap-2 md:flex"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500"><Rocket className="h-4 w-4" /></span><span className="font-black uppercase tracking-tighter">Elion</span></button>
          <button onClick={() => navigateTo('/signup')} className="rounded-full bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-950 transition-colors hover:bg-cyan-400">Join this course</button>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-36 md:pb-32 md:pt-48 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div><p className="eyebrow text-cyan-400">{course.school}</p><h1 className="mt-6 max-w-4xl text-6xl font-black uppercase leading-[0.9] tracking-tighter md:text-8xl">{course.title}</h1><p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-slate-300">{course.eyebrow}. {course.description}</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={() => navigateTo('/signup')} className="group inline-flex items-center gap-3 rounded-2xl bg-cyan-500 px-7 py-4 text-xs font-black uppercase tracking-widest text-slate-950 shadow-2xl shadow-cyan-500/20 transition-colors hover:bg-cyan-400">Reserve your place <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></button><a href="#details" className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-widest transition-colors hover:bg-white hover:text-slate-950">See what you’ll make</a></div></div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10"><img src={course.image} alt={`${course.title} learners`} className="human-image h-[360px] w-full object-cover md:h-[440px]" referrerPolicy="no-referrer" /><div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" /><div className="absolute bottom-7 left-7 right-7 grid grid-cols-3 gap-3"><div className="border-t border-white/30 pt-3"><Clock3 className="mb-2 h-4 w-4 text-cyan-400" /><p className="text-xs font-bold text-white">{course.duration}</p></div><div className="border-t border-white/30 pt-3"><Laptop className="mb-2 h-4 w-4 text-cyan-400" /><p className="text-xs font-bold text-white">Live online</p></div><div className="border-t border-white/30 pt-3"><p className="mb-2 text-[10px] uppercase tracking-widest text-cyan-400">Tuition</p><p className="text-xs font-bold text-white">{course.price}</p></div></div></div>
        </section>

        <section id="details" className="border-y border-white/5 bg-white/[0.03] py-24 md:py-32"><div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="eyebrow text-cyan-400">What you’ll leave with</p><h2 className="mt-5 text-5xl font-black uppercase leading-none tracking-tighter md:text-7xl">A skill you can show.</h2><p className="mt-6 max-w-md text-lg leading-relaxed text-slate-400">This is not a room full of slides. You’ll practise, get feedback and build something that gives the learning somewhere to land.</p></div><div className="space-y-4">{course.outcomes.map((outcome, index) => <div key={outcome} className="flex gap-5 border-t border-white/10 py-5"><span className="font-mono text-sm text-cyan-400">0{index + 1}</span><p className="text-lg font-medium text-slate-200">{outcome}</p></div>)}</div></div></section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-24 md:grid-cols-2 md:py-32"><div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-8 md:p-12"><GraduationCap className="h-8 w-8 text-cyan-400" /><p className="eyebrow mt-10 text-cyan-400">Your practical project</p><h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tighter">Make the learning visible.</h2><p className="mt-6 text-lg leading-relaxed text-slate-200">{course.project}</p></div><div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-12"><Users className="h-8 w-8 text-cyan-400" /><p className="eyebrow mt-10 text-cyan-400">Who this is for</p><h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tighter">Come as you are.</h2><p className="mt-6 text-lg leading-relaxed text-slate-300">{course.audience}</p><div className="mt-8 flex items-center gap-3 text-sm font-bold text-slate-400"><Check className="h-5 w-5 text-cyan-400" /> No perfect starting point required.</div></div></section>

        <section className="bg-cyan-500 py-20 text-slate-950 md:py-28"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-end"><div><p className="eyebrow text-slate-800">Ready when you are</p><h2 className="mt-4 max-w-3xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">Give yourself something real to build.</h2></div><button onClick={() => navigateTo('/signup')} className="group inline-flex shrink-0 items-center gap-3 rounded-2xl bg-slate-950 px-7 py-4 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-slate-950">Join {course.title} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></button></div></section>
      </main>
      <footer className="border-t border-white/5 py-10"><div className="mx-auto flex max-w-7xl justify-between px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"><span>Elion Academy</span><span>{course.title}</span></div></footer>
    </div>
  );
};

export default AcademyCourse;
