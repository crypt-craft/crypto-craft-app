import { TermsOfUseDialog } from "@/components/legal/TermsOfUseDialog";
import { PrivacyPolicyDialog } from "@/components/legal/PrivacyPolicyDialog";
import { HowItWorksDialog } from "@/components/legal/HowItWorksDialog";
import { siteConfig } from "@/config/site.config";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 bg-gray-800 relative z-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <TermsOfUseDialog
            trigger={
              <button className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                Terms of Use
              </button>
            }
          />
          <PrivacyPolicyDialog
            trigger={
              <button className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                Privacy Policy
              </button>
            }
          />
          <HowItWorksDialog
            trigger={
              <button className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                How It Works
              </button>
            }
          />
        </div>
      </div>
    </footer>
  );
}
