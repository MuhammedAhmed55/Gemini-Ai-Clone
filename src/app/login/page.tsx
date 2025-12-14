import LoginForm from "@/components/auth/LoginForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Animated Illustration */}
        <div className="hidden lg:flex items-center justify-center p-8 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 opacity-50" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
          
          {/* Animated floating cards */}
          <div className="relative z-10 space-y-6 w-full max-w-sm">
            {/* Main illustration card */}
            <div className="animate-float">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-lg rounded-3xl p-12 border border-primary/30 shadow-2xl">
                <div className="space-y-8">
                  {/* AI Icon */}
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl animate-spin-slow opacity-75" />
                      <div className="absolute inset-1 bg-background rounded-2xl flex items-center justify-center">
                        <span className="text-4xl">✨</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text content */}
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Welcome Back
                    </h2>
                    <p className="text-sm text-foreground/60">
                      Dive back into your creative workspace and continue your journey with AI-powered note taking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating feature cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-float-delayed-1 bg-card/50 backdrop-blur-md rounded-2xl p-4 border border-border/50 hover:border-primary/50 transition-all">
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-xs font-semibold text-foreground/80">Fast & Secure</p>
              </div>
              <div className="animate-float-delayed-2 bg-card/50 backdrop-blur-md rounded-2xl p-4 border border-border/50 hover:border-accent/50 transition-all">
                <div className="text-2xl mb-2">🤖</div>
                <p className="text-xs font-semibold text-foreground/80">AI Powered</p>
              </div>
              <div className="animate-float-delayed-3 bg-card/50 backdrop-blur-md rounded-2xl p-4 border border-border/50 hover:border-secondary/50 transition-all">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-xs font-semibold text-foreground/80">Smart Notes</p>
              </div>
              <div className="animate-float-delayed-1 bg-card/50 backdrop-blur-md rounded-2xl p-4 border border-border/50 hover:border-primary/50 transition-all">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-xs font-semibold text-foreground/80">Easy to Use</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md animate-fade-in">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}