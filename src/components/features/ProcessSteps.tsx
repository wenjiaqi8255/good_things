import React from 'react';

const steps = [
  {
    number: 1,
    title: '选择场景',
    description: '从五大核心场景中选择你想要改变的领域'
  },
  {
    number: 2,
    title: '沉浸体验',
    description: '通过引导式问答，逐步具象化你的理想状态'
  },
  {
    number: 3,
    title: '可视呈现',
    description: 'AI 将为你生成专属的理想画面，助你坚定前行'
  }
];

export function ProcessSteps() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          三步开启你的显化之旅
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}