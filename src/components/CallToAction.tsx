import React from 'react';

export function CallToAction() {
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl py-16 px-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          准备好开启你的理想生活了吗？
        </h2>
        <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
          加入 GoodThings，让我们一起通过科学的方法，将理想转化为现实
        </p>
        <button 
          onClick={() => window.location.href = '/scenes'}
          className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-colors"
        >
          立即开始
        </button>
      </div>
    </section>
  );
}