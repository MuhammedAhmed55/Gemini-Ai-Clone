import SignUpForm from "@/components/auth/SignUpForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Animated Illustration */}
        <div className="hidden lg:flex items-center justify-center p-8 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 opacity-50" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
          
          {/* Animated floating cards */}
          <div className="relative z-10 space-y-6 w-full max-w-sm">
            {/* Main illustration card */}
            <div className="animate-float">
              <div className="bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-lg rounded-3xl p-12 border border-accent/30 shadow-2xl">
                <div className="space-y-8">
                  {/* Start Icon */}
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-accent rounded-2xl animate-spin-slow opacity-75" />
                      <div className="absolute inset-1 bg-background rounded-2xl flex items-center justify-center">
                        <span className="text-4xl">🌟</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text content */}
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                      Join Our Community
                    </h2>
                    <p className="text-sm text-foreground/60">
                      Start taking smarter notes with AI assistance and unlock your full productivity potential
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating feature cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-float-delayed-1 bg-card/50 backdrop-blur-md rounded-2xl p-4 border border-border/50 hover:border-accent/50 transition-all">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-xs font-semibold text-foreground/80">Instant Setup</p>
              </div>
              <div className="animate-float-delayed-2 bg-card/50 backdrop-blur-md rounded-2xl p-4 border border-border/50 hover:border-primary/50 transition-all">
                <div className="text-2xl mb-2">🎨</div>
                <p className="text-xs font-semibold text-foreground/80">Beautiful UI</p>
              </div>
              <div className="animate-float-delayed-3 bg-card/50 backdrop-blur-md rounded-2xl p-4 border border-border/50 hover:border-secondary/50 transition-all">
                <div className="text-2xl mb-2">💡</div>
                <p className="text-xs font-semibold text-foreground/80">Smart Ideas</p>
              </div>
              <div className="animate-float-delayed-1 bg-card/50 backdrop-blur-md rounded-2xl p-4 border border-border/50 hover:border-accent/50 transition-all">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-xs font-semibold text-foreground/80">Privacy First</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md animate-fade-in">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
