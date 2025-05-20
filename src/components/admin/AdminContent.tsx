
import React, { useState, useEffect, ErrorInfo } from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import PermissionsSheet from "@/components/admin/PermissionsSheet";
import DiagnosticDisplay from "@/components/admin/diagnostics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import RenderStateTracker, { RenderState } from "@/components/admin/RenderStateTracker";

interface AdminContentProps {
  userRole: string;
  showDiagnostics: boolean;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error, errorInfo: ErrorInfo) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error, errorInfo: ErrorInfo) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Rendering Error</AlertTitle>
          <AlertDescription>
            <p>An error occurred while loading content: {this.state.error?.message}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Check console for more details.
            </p>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

const AdminContent: React.FC<AdminContentProps> = ({ userRole, showDiagnostics }) => {
  const [renderState, setRenderState] = useState<RenderState>({
    mainLayoutLoaded: true,
    adminAccessLoaded: true,
    adminTabsStarted: false,
    adminTabsLoaded: false,
  });
  
  const [contentError, setContentError] = useState<string | null>(null);

  // Initialize and track rendering state
  useEffect(() => {
    console.log("AdminContent mounted with props:", { userRole, showDiagnostics });
    
    try {
      // Mark AdminTabs as started
      setRenderState(prev => ({...prev, adminTabsStarted: true}));
      
      // Check if hash exists
      const hash = window.location.hash.substring(1);
      console.log("Current hash for tabs:", hash || "none");
      
      // Add check for tabs after render
      setTimeout(() => {
        const tabsElement = document.querySelector('[role="tablist"]');
        console.log("Tabs element present:", !!tabsElement);
        
        const tabContents = document.querySelectorAll('[data-value]');
        console.log("Tab content elements found:", tabContents.length);
        
        if (tabsElement && tabContents.length > 0) {
          setRenderState(prev => ({...prev, adminTabsLoaded: true}));
        } else {
          console.error("AdminTabs failed to render completely");
          setContentError("AdminTabs não foi renderizado completamente");
        }
      }, 1000);
    } catch (error) {
      console.error("Error initializing AdminTabs state:", error);
      setContentError(`Error initializing AdminTabs: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [userRole, showDiagnostics]);

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error("Error caught in AdminContent:", error, errorInfo);
    setContentError(`${error.message}\n${errorInfo.componentStack}`);
  };

  return (
    <>
      {/* Always show diagnostic component to help with debugging */}
      {showDiagnostics && <DiagnosticDisplay />}
      
      {/* Show current render state */}
      <RenderStateTracker renderState={renderState} />
      
      {contentError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Content Error</AlertTitle>
          <AlertDescription>
            <p>{contentError}</p>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Render AdminTabs with ErrorBoundary */}
      <ErrorBoundary onError={handleError}>
        <AdminTabs userRole={userRole} showDiagnostics={showDiagnostics} />
      </ErrorBoundary>
      
      {/* Conditional rendering of PermissionsSheet */}
      {(userRole === 'admin' || userRole === 'super_admin') && 
        <PermissionsSheet userRole={userRole} />}
    </>
  );
};

export default AdminContent;
