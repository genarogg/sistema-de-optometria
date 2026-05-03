'use client'

export function OptometrySpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="flex flex-col items-center gap-8">
        {/* Main Spinning Lens Wheel */}
        <div className="relative w-40 h-40">
          {/* Outer Circle Background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 shadow-xl" />
          
          {/* Rotating Container */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            {/* Lens 1 - Blue */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg transform" />
            
            {/* Lens 2 - Teal */}
            <div className="absolute top-1/2 right-2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg" />
            
            {/* Lens 3 - Cyan */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg" />
            
            {/* Lens 4 - Blue-Teal */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg" />
          </div>

          {/* Center Circle - Pupil */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-800 to-black shadow-inner flex items-center justify-center">
              {/* Shine effect */}
              <div className="w-3 h-3 rounded-full bg-white opacity-70" />
            </div>
          </div>

          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-300/30" />
          <div className="absolute inset-4 rounded-full border-2 border-teal-300/30" />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Examinando</p>
          <p className="text-sm text-gray-500 mt-2">Procesando tu visión...</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          <div 
            className="w-2 h-2 rounded-full bg-blue-500"
            style={{
              animation: 'bounce 1.4s infinite',
              animationDelay: '0s'
            }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-teal-500"
            style={{
              animation: 'bounce 1.4s infinite',
              animationDelay: '0.2s'
            }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-cyan-500"
            style={{
              animation: 'bounce 1.4s infinite',
              animationDelay: '0.4s'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          40% {
            transform: translateY(-8px);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
