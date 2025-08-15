/**
 * WebXR Type Definitions
 * 
 * This file provides type definitions for the WebXR API.
 * It's used to fix the TypeScript error about missing webxr type definitions.
 */

declare namespace WebXR {
  interface XRFrame {
    session: XRSession;
    getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | null;
    getPose(space: XRSpace, baseSpace: XRReferenceSpace): XRPose | null;
  }

  interface XRSession {
    renderState: XRRenderState;
    inputSources: XRInputSource[];
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>;
    requestAnimationFrame(callback: XRFrameRequestCallback): number;
    cancelAnimationFrame(handle: number): void;
    end(): Promise<void>;
  }

  interface XRReferenceSpace {
    type: XRReferenceSpaceType;
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
  }

  interface XRRigidTransform {
    matrix: Float32Array;
    position: DOMPoint;
    orientation: DOMPoint;
    linearVelocity?: DOMPoint;
    angularVelocity?: DOMPoint;
  }

  interface XRPose {
    transform: XRRigidTransform;
    emulatedPosition: boolean;
    angularVelocity?: DOMPoint;
    linearVelocity?: DOMPoint;
  }

  interface XRViewerPose extends XRPose {
    views: XRView[];
  }

  interface XRView {
    eye: XREye;
    projectionMatrix: Float32Array;
    transform: XRRigidTransform;
    isFirstPersonObserver: boolean;
  }

  interface XRInputSource {
    handedness: XRHandedness;
    targetRaySpace: XRSpace;
    gripSpace: XRSpace | null;
    profiles: string[];
    gamepad: Gamepad | null;
  }

  interface XRSpace {
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
  }

  interface XRRenderState {
    baseLayer: XRWebGLLayer | null;
    outputContext: XRWebGLRenderingContext | null;
    depthNear: number;
    depthFar: number;
    inlineVerticalFieldOfView: number | null;
  }

  interface XRWebGLLayer {
    context: XRWebGLRenderingContext;
    antialias: boolean;
    ignoreDepthValues: boolean;
    framebuffer: WebGLFramebuffer | null;
    framebufferWidth: number;
    framebufferHeight: number;
  }

  interface XRWebGLRenderingContext extends WebGLRenderingContext {
    makeXRCompatible(): Promise<void>;
  }

  type XRReferenceSpaceType = 'viewer' | 'local' | 'local-floor' | 'bounded-floor' | 'unbounded';
  type XREye = 'left' | 'right' | 'none';
  type XRHandedness = 'none' | 'left' | 'right';
  type XRFrameRequestCallback = (time: number, frame: XRFrame) => void;
}

interface Navigator {
  xr: {
    isSessionSupported(sessionType: string): Promise<boolean>;
    requestSession(sessionType: string, options?: any): Promise<WebXR.XRSession>;
  };
} 