import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import React, { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { anchors, featureHotspots as gestures, journeyStages, personaJourneys } from "./data";

const MODEL_URL = "/models/ray-ban-meta/source/Untitled.glb";
const BASE_CAMERA_DISTANCE = 5.15;
const MODEL_TARGET_WIDTH = 2.95;
const FRONT_ROTATION = [0.03, Math.PI, 0];
const FOCUS_ROTATIONS = {
  temple: [0.05, Math.PI + 0.72, 0],
  speaker: [0.03, Math.PI - 0.62, 0],
  full: FRONT_ROTATION,
  none: FRONT_ROTATION
};
const FEATURE_LABELS = {
  touch_sensor: "Touch sensor",
  onboarding_feedback: "Onboarding feedback",
  gesture_controls: "Gesture controls",
  feedback_system: "Feedback system",
  audio_system: "Audio system",
  music_controls: "Music controls",
  navigation: "Navigation",
  seamless_interaction: "Seamless interaction",
  multi_feature_usage: "Multi-feature use",
  gesture_detection: "Gesture detection",
  interaction_zones: "Interaction zones",
  passive_audio: "Passive audio",
  routine_use: "Routine use"
};

const zoneColors = {
  temple: "#2dd4bf",
  "frame edge": "#f9736b",
  "touch control": "#a3e635",
  "audio/input": "#facc15"
};

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Prototype render error", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-screen">
          <strong>Prototype runtime error</strong>
          <p>{this.state.error.message}</p>
          <span>Open the browser console for the stack trace. The UI is showing this instead of a blank white page.</span>
        </div>
      );
    }

    return this.props.children;
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function addVectors(a = [0, 0, 0], b = [0, 0, 0]) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function getAnchorPosition(anchor, overrides = {}) {
  const override = overrides[anchor.id] || {};
  const localPosition = override.localPosition || anchor.localPosition;
  const offset = override.offset || anchor.offset || [0, 0, 0];
  return addVectors(localPosition, offset);
}

function getGestureAnchor(gesture, anchorOverrides) {
  const anchor = anchors.find((item) => item.id === gesture.anchorId) || anchors[0];
  return {
    ...anchor,
    resolvedPosition: getAnchorPosition(anchor, anchorOverrides)
  };
}

function getFocusRotation(stage) {
  return FOCUS_ROTATIONS[stage.modelFocus] || FRONT_ROTATION;
}

function ModelRig({ controlTarget, interactionMode, children }) {
  const groupRef = useRef(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    const damping = 1 - Math.exp(-delta * 8);
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, controlTarget.rotation[0], damping);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, controlTarget.rotation[1], damping);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, controlTarget.rotation[2], damping);
    }

    if (interactionMode === "hand") {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, controlTarget.cameraDistance, damping);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  });

  return <group ref={groupRef} rotation={FRONT_ROTATION}>{children}</group>;
}

function GlassesModel({
  selectedGesture,
  previewGesture,
  onSelect,
  onPreview,
  anchorOverrides,
  debugOptions,
  modelGlobalScale,
  pivotOffset,
  hotspotScale,
  personaJourney
}) {
  const active = previewGesture || selectedGesture;
  const activeAnchor = getGestureAnchor(active, anchorOverrides);

  return (
    <group>
      <RealGlassesAsset modelGlobalScale={modelGlobalScale} pivotOffset={pivotOffset} />
      <ModelAnchorPoints
        activeAnchorId={activeAnchor.id}
        anchorOverrides={anchorOverrides}
        debugOptions={debugOptions}
      />
      {gestures.map((gesture) => {
        const anchor = getGestureAnchor(gesture, anchorOverrides);
        return (
          <Hotspot
            key={gesture.id}
            gesture={gesture}
            anchor={anchor}
            isActive={active.id === gesture.id}
            onSelect={onSelect}
            onPreview={onPreview}
            hotspotScale={hotspotScale}
            personaJourney={personaJourney}
          />
        );
      })}
    </group>
  );
}

function RealGlassesAsset({ modelGlobalScale, pivotOffset }) {
  const gltf = useGLTF(MODEL_URL);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const transform = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    return {
      center: center.toArray(),
      baseScale: MODEL_TARGET_WIDTH / size.x,
      size: size.toArray()
    };
  }, [scene]);

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.filter(Boolean).forEach((material) => {
          material.roughness = Math.max(material.roughness || 0.35, 0.28);
        });
      }
    });
  }, [scene]);

  const scale = transform.baseScale * modelGlobalScale;

  return (
    <group scale={scale} position={pivotOffset}>
      {/* Pivot correction: the imported GLB is translated by its bounding-box center, then the whole asset is scaled once. */}
      <primitive
        object={scene}
        position={[
          -transform.center[0],
          -transform.center[1],
          -transform.center[2]
        ]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

function ModelAnchorPoints({ activeAnchorId, anchorOverrides, debugOptions }) {
  const visibleAnchors = debugOptions.anchorDebug ? anchors : anchors.filter((anchor) => anchor.id === activeAnchorId);

  return (
    <>
      {debugOptions.showAxes && <axesHelper args={[1.2]} />}
      {debugOptions.showBounds && (
        <mesh>
          <boxGeometry args={[3.05, 0.82, 2.9]} />
          <meshBasicMaterial color="#111417" wireframe transparent opacity={0.16} />
        </mesh>
      )}
      {visibleAnchors.map((anchor) => {
        const position = getAnchorPosition(anchor, anchorOverrides);
        const color = zoneColors[anchor.zone] || "#ffffff";
        const active = anchor.id === activeAnchorId;
        return (
          <group key={anchor.id} position={position}>
            <mesh renderOrder={2}>
              <sphereGeometry args={[active ? 0.075 : 0.045, 20, 12]} />
              <meshBasicMaterial color={color} transparent opacity={active ? 0.78 : 0.38} depthTest={false} />
            </mesh>
            {debugOptions.anchorDebug && (
              <Html center>
                <span className="anchor-debug-label">{anchor.label}</span>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

function Hotspot({ gesture, anchor, isActive, onSelect, onPreview, hotspotScale, personaJourney }) {
  const color = zoneColors[anchor.zone] || "#ffffff";

  return (
    <Html position={anchor.resolvedPosition} center zIndexRange={[20, 0]} occlude={false}>
      <div className="hotspot-wrap">
        <button
          data-hotspot-id={gesture.id}
          className={`hotspot ${isActive ? "is-active" : ""}`}
          style={{
            "--hotspot-color": color,
            "--hotspot-scale": clamp(hotspotScale, 0.72, 1.45)
          }}
          onMouseEnter={() => onPreview(gesture.id)}
          onMouseLeave={() => onPreview(null)}
          onFocus={() => onPreview(gesture.id)}
          onBlur={() => onPreview(null)}
          onClick={() => onSelect(gesture.id)}
          aria-label={`Select ${gesture.name}`}
        >
          <span />
        </button>
      </div>
    </Html>
  );
}

function HotspotAnnotations({ activeHotspot, personaJourney }) {
  if (!activeHotspot) return null;
  const moment = personaJourney.moments[activeHotspot.id] || personaJourney.moments.touchpad;

  return (
    <div className="annotation-layer">
      <article className="annotation-card">
        <span>{activeHotspot.location}</span>
        <h3>{activeHotspot.name}</h3>
        <dl>
          <div><dt>What it does</dt><dd>{activeHotspot.whatItDoes}</dd></div>
          <div><dt>Why it matters</dt><dd>{activeHotspot.whyItMatters}</dd></div>
          <div><dt>Persona insight</dt><dd>{moment.why}</dd></div>
          <div><dt>Likely interaction</dt><dd>{activeHotspot.likelyInteraction}</dd></div>
          <div><dt>Emotion / behavior</dt><dd>{moment.feeling}: {moment.doing}</dd></div>
          <div><dt>Where / when</dt><dd>{moment.where}; {moment.when}</dd></div>
          <div><dt>Listening</dt><dd>{moment.listening}</dd></div>
        </dl>
      </article>
    </div>
  );
}

function HandTrackingController({
  enabled,
  onTargetChange,
  onStatusChange,
  onModeFallback,
  onPointerUpdate,
  onSelectGesture,
  onPreviewGesture
}) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const pinchRef = useRef(null);
  const lastResetRef = useRef(0);
  const lastSelectRef = useRef(0);
  const fistStartRef = useRef(null);
  const statusRef = useRef("");

  const setStableStatus = useCallback((message) => {
    if (statusRef.current !== message) {
      statusRef.current = message;
      onStatusChange(message);
    }
  }, [onStatusChange]);

  useEffect(() => {
    if (!enabled) {
      setStableStatus("Mouse controls active");
      return undefined;
    }

    let cancelled = false;

    async function start() {
      try {
        setStableStatus("Loading hand tracker");
        const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm");
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.55,
          minHandPresenceConfidence: 0.55,
          minTrackingConfidence: 0.5
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          landmarker.close();
          return;
        }

        streamRef.current = stream;
        landmarkerRef.current = landmarker;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStableStatus("Hold your hand in frame");
        rafRef.current = requestAnimationFrame(trackFrame);
      } catch (error) {
        console.error(error);
        setStableStatus("Camera unavailable. Mouse controls active.");
        onModeFallback();
      }
    }

    function trackFrame() {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (video && landmarker && video.readyState >= 2) {
        const result = landmarker.detectForVideo(video, performance.now());
        const hand = result.landmarks?.[0];

        if (hand) {
          const thumbTip = hand[4];
          const indexTip = hand[8];
          const indexPip = hand[6];
          const middleTip = hand[12];
          const middlePip = hand[10];
          const ringTip = hand[16];
          const ringPip = hand[14];
          const pinkyTip = hand[20];
          const pinkyPip = hand[18];
          const palm = [0, 5, 9, 13, 17].reduce(
            (acc, index) => [acc[0] + hand[index].x / 5, acc[1] + hand[index].y / 5],
            [0, 0]
          );

          const pinchDistance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
          const foldedFingers = [
            indexTip.y > indexPip.y + 0.02,
            middleTip.y > middlePip.y + 0.02,
            ringTip.y > ringPip.y + 0.02,
            pinkyTip.y > pinkyPip.y + 0.02
          ].filter(Boolean).length;
          const fist = foldedFingers >= 4 && pinchDistance > 0.12;
          const isPinching = pinchDistance < 0.14;
          const pointer = {
            x: 1 - indexTip.x,
            y: indexTip.y,
            pinching: isPinching
          };
          const pointerPixels = {
            x: pointer.x * window.innerWidth,
            y: pointer.y * window.innerHeight
          };
          const nearestHotspot = gestures
            .map((item) => {
              const element = document.querySelector(`[data-hotspot-id="${item.id}"]`);
              if (!element) return null;
              const rect = element.getBoundingClientRect();
              return {
                gesture: item,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                distance: Math.hypot(rect.left + rect.width / 2 - pointerPixels.x, rect.top + rect.height / 2 - pointerPixels.y)
              };
            })
            .filter(Boolean)
            .sort((a, b) => a.distance - b.distance)[0];
          const hoverGesture = nearestHotspot && nearestHotspot.distance < 210 ? nearestHotspot.gesture : null;

          onPointerUpdate({ ...pointer, hovering: hoverGesture?.id || null });
          onPreviewGesture(hoverGesture?.id || null);

          if (fist) {
            fistStartRef.current ??= performance.now();
          } else {
            fistStartRef.current = null;
          }

          if (fistStartRef.current && performance.now() - fistStartRef.current > 900 && performance.now() - lastResetRef.current > 1400) {
            lastResetRef.current = performance.now();
            fistStartRef.current = null;
            pinchRef.current = null;
            setStableStatus("Fist reset");
            onTargetChange({ rotation: FRONT_ROTATION, cameraDistance: BASE_CAMERA_DISTANCE });
          } else {
            const rotationX = FRONT_ROTATION[0] + clamp((palm[1] - 0.5) * 1.15, -0.62, 0.62);
            const rotationY = FRONT_ROTATION[1] + clamp((0.5 - palm[0]) * 2.9, -1.65, 1.65);

            if (isPinching) {
              pinchRef.current = { distance: pinchDistance };
              setStableStatus("Pinch and move to rotate");
              onPreviewGesture(null);
              onTargetChange({
                rotation: [rotationX, rotationY, 0],
                cameraDistance: null
              });
            } else {
              pinchRef.current = null;
              setStableStatus(hoverGesture ? `Pointing at ${hoverGesture.name}` : "Point at a hotspot");
              if (hoverGesture && performance.now() - lastSelectRef.current > 900) {
                lastSelectRef.current = performance.now();
                onSelectGesture(hoverGesture.id);
              }
            }
          }
        } else {
          pinchRef.current = null;
          fistStartRef.current = null;
          onPointerUpdate(null);
          onPreviewGesture(null);
          setStableStatus("Hold your hand in frame");
        }
      }

      rafRef.current = requestAnimationFrame(trackFrame);
    }

    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      streamRef.current = null;
    };
  }, [enabled, onModeFallback, onPointerUpdate, onPreviewGesture, onSelectGesture, setStableStatus, onTargetChange]);

  return <video ref={videoRef} className="tracking-video" playsInline muted />;
}

function GestureCalibrationOverlay({ interactionMode, trackingStatus }) {
  return (
    <div className="calibration-overlay">
      <strong>{interactionMode === "hand" ? trackingStatus : "Mouse controls active"}</strong>
      <span>Hold your hand in frame</span>
      <span>Pinch and move to rotate</span>
      <span>Release pinch to point at hotspots</span>
      <span>Hold a fist to reset</span>
    </div>
  );
}

function HandPointer({ pointer }) {
  if (!pointer) return null;

  return (
    <div
      className={`hand-pointer ${pointer.pinching ? "is-pinching" : ""} ${pointer.hovering ? "is-hovering" : ""}`}
      style={{
        left: `${pointer.x * 100}%`,
        top: `${pointer.y * 100}%`
      }}
    >
      <span>{pointer.pinching ? "Rotate" : pointer.hovering ? "Hotspot" : "Point"}</span>
    </div>
  );
}

function InteractionModeToggle({ interactionMode, setInteractionMode }) {
  return (
    <div className="mode-toggle" role="group" aria-label="Interaction mode">
      {["hand", "mouse"].map((mode) => (
        <button
          key={mode}
          className={interactionMode === mode ? "active" : ""}
          onClick={() => setInteractionMode(mode)}
        >
          {mode === "hand" ? "Hand Tracking" : "Mouse Controls"}
        </button>
      ))}
    </div>
  );
}

function DevPanel({
  selectedAnchor,
  anchorOverrides,
  setAnchorOverrides,
  debugOptions,
  setDebugOptions,
  hotspotScale,
  setHotspotScale,
  modelGlobalScale,
  setModelGlobalScale,
  pivotOffset,
  setPivotOffset,
  setMouseFallbackMode
}) {
  const override = anchorOverrides[selectedAnchor.id] || {};
  const localPosition = override.localPosition || selectedAnchor.localPosition;
  const offset = override.offset || selectedAnchor.offset;

  const updateAnchorVector = (key, axis, value) => {
    setAnchorOverrides((current) => {
      const next = current[selectedAnchor.id] || {};
      const base = next[key] || selectedAnchor[key];
      const updated = [...base];
      updated[axis] = Number(value);
      return { ...current, [selectedAnchor.id]: { ...next, [key]: updated } };
    });
  };

  return (
    <div className="dev-panel">
      <div className="dev-header">
        <strong>Anchor fitting</strong>
        <button onClick={() => setDebugOptions((value) => ({ ...value, open: !value.open }))}>
          {debugOptions.open ? "Hide" : "Show"}
        </button>
      </div>

      {debugOptions.open && (
        <>
          <label><input type="checkbox" checked={debugOptions.anchorDebug} onChange={(event) => setDebugOptions((value) => ({ ...value, anchorDebug: event.target.checked }))} /> Anchor debug</label>
          <label><input type="checkbox" checked={debugOptions.showBounds} onChange={(event) => setDebugOptions((value) => ({ ...value, showBounds: event.target.checked }))} /> Bounding box</label>
          <label><input type="checkbox" checked={debugOptions.showAxes} onChange={(event) => setDebugOptions((value) => ({ ...value, showAxes: event.target.checked }))} /> Axes helper</label>
          <div className="dev-grid">
            <span>{selectedAnchor.label}</span>
            {["x", "y", "z"].map((axis, index) => (
              <label key={`local-${axis}`}>
                local {axis}
                <input type="number" step="0.01" value={localPosition[index]} onChange={(event) => updateAnchorVector("localPosition", index, event.target.value)} />
              </label>
            ))}
            {["x", "y", "z"].map((axis, index) => (
              <label key={`offset-${axis}`}>
                offset {axis}
                <input type="number" step="0.01" value={offset[index]} onChange={(event) => updateAnchorVector("offset", index, event.target.value)} />
              </label>
            ))}
            <label>
              hotspot scale
              <input type="number" step="0.05" min="0.72" max="1.45" value={hotspotScale} onChange={(event) => setHotspotScale(Number(event.target.value))} />
            </label>
            <label>
              model scale
              <input type="number" step="0.02" min="0.7" max="1.3" value={modelGlobalScale} onChange={(event) => setModelGlobalScale(Number(event.target.value))} />
            </label>
            {["x", "y", "z"].map((axis, index) => (
              <label key={`pivot-${axis}`}>
                pivot {axis}
                <input
                  type="number"
                  step="0.05"
                  value={pivotOffset[index]}
                  onChange={(event) => setPivotOffset((current) => current.map((item, itemIndex) => itemIndex === index ? Number(event.target.value) : item))}
                />
              </label>
            ))}
          </div>
          <button className="reset-anchor" onClick={() => setAnchorOverrides((current) => {
            const next = { ...current };
            delete next[selectedAnchor.id];
            return next;
          })}>
            Reset selected anchor
          </button>
        </>
      )}
    </div>
  );
}

function HandCaptureOverlay({ gesture, stage, viewMode }) {
  if (viewMode === "persona" || !stage.ui.gestureHints) return null;

  return (
    <div className={`hand-capture path-${gesture.path}`} aria-label={`${gesture.name} dashcam gesture overlay`}>
      <img
        className="dashcam-context"
        src="https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=900&q=70"
        alt="Street motion context for dashcam capture"
      />
      <div className="capture-grid" />
      <div className="gesture-label">
        <span>{gesture.name}</span>
        <strong>{gesture.location}</strong>
      </div>
      <div className="gesture-path">
        <span className="motion-line line-a" />
        <span className="motion-line line-b" />
        <span className="motion-arrow" />
      </div>
      <div className="hand">
        <span className="finger finger-one" />
        <span className="finger finger-two" />
        <span className="finger finger-three" />
        <span className="finger finger-four" />
        <span className="palm" />
      </div>
    </div>
  );
}

function LeftPanel({ personaId, setPersonaId, personaJourney, activeMoment, activeGesture, stage, stageId, setStageId, autoPlay, setAutoPlay }) {
  return (
    <aside className="panel left-panel">
      <div className="eyebrow">Meta glasses journey</div>
      <h1>{personaJourney.name}</h1>
      <p className="intro">{personaJourney.archetype} · {personaJourney.role}</p>

      <label className="field">
        Persona
        <select value={personaId} onChange={(event) => setPersonaId(event.target.value)}>
          {personaJourneys.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </label>

      <label className="field">
        Journey stage
        <select value={stageId} onChange={(event) => setStageId(event.target.value)}>
          {journeyStages.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
      </label>

      <button className={`autoplay ${autoPlay ? "active" : ""}`} onClick={() => setAutoPlay((value) => !value)}>
        {autoPlay ? "Pause presentation loop" : "Autoplay demo mode"}
      </button>

      <section className="stage-summary">
        <span>{personaJourney.platform}</span>
        <h2>{activeGesture.name}</h2>
        <p>{personaJourney.summary}</p>
      </section>

      <section className="persona-mini">
        <span>{activeMoment.journey}</span>
        <p><strong>Feeling:</strong> {activeMoment.feeling}</p>
        <p><strong>Doing:</strong> {activeMoment.doing}</p>
        <p><strong>Why:</strong> {activeMoment.why}</p>
        <p><strong>Where:</strong> {activeMoment.where}</p>
        <p><strong>Listening:</strong> {activeMoment.listening}</p>
        <p><strong>When:</strong> {activeMoment.when}</p>
      </section>
    </aside>
  );
}

function CenterStage({
  gesture,
  personaJourney,
  previewId,
  setPreviewId,
  setSelectedGestureId,
  viewMode,
  scenario,
  annotationMode,
  interactionMode,
  setInteractionMode,
  controlTarget,
  onTargetChange,
  trackingStatus,
  setTrackingStatus,
  anchorOverrides,
  setAnchorOverrides,
  debugOptions,
  setDebugOptions,
  hotspotScale,
  setHotspotScale,
  modelGlobalScale,
  setModelGlobalScale,
  pivotOffset,
  setPivotOffset,
  setMouseFallbackMode,
  handPointer,
  setHandPointer
}) {
  const selectedAnchor = getGestureAnchor(gesture, anchorOverrides);
  const activeHotspot = gestures.find((item) => item.id === previewId) || gesture;

  return (
    <main className="center-stage">
      <div className="viewer-shell">
        <Canvas camera={{ position: [0, 0.58, BASE_CAMERA_DISTANCE], fov: 42, near: 0.08, far: 40 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[2, 3, 4]} intensity={2.1} />
            <ModelRig
              controlTarget={controlTarget}
              interactionMode={interactionMode}
            >
              <GlassesModel
                selectedGesture={gesture}
                previewGesture={gestures.find((item) => item.id === previewId)}
                onSelect={setSelectedGestureId}
                onPreview={setPreviewId}
                anchorOverrides={anchorOverrides}
                debugOptions={debugOptions}
                modelGlobalScale={modelGlobalScale}
                pivotOffset={pivotOffset}
                hotspotScale={hotspotScale}
                personaJourney={personaJourney}
              />
            </ModelRig>
            <ContactShadows position={[0, -0.58, 0]} opacity={0.24} scale={4.2} blur={2.4} />
            <Environment preset="city" />
            <OrbitControls enabled={interactionMode === "mouse"} enablePan={false} minDistance={3.35} maxDistance={6.4} />
          </Suspense>
        </Canvas>
        {interactionMode === "hand" && (
          <HandTrackingController
            enabled
            onTargetChange={onTargetChange}
            onStatusChange={setTrackingStatus}
            onModeFallback={setMouseFallbackMode}
            onPointerUpdate={setHandPointer}
            onSelectGesture={setSelectedGestureId}
            onPreviewGesture={setPreviewId}
          />
        )}
        <InteractionModeToggle interactionMode={interactionMode} setInteractionMode={setInteractionMode} />
        <GestureCalibrationOverlay interactionMode={interactionMode} trackingStatus={trackingStatus} />
        <HandPointer pointer={handPointer} />
        <HotspotAnnotations
          activeHotspot={activeHotspot}
          personaJourney={personaJourney}
        />
        <div className="viewer-instructions">
          <span>{interactionMode === "hand" ? "Hand controls active" : "Drag to rotate"}</span>
          <span>{interactionMode === "hand" ? "Pinch to rotate" : "Scroll to zoom"}</span>
          <span>Hover a hotspot</span>
        </div>
      </div>
    </main>
  );
}

function App() {
  const [personaId, setPersonaId] = useState("sheila");
  const [stageId, setStageId] = useState("entry");
  const [selectedGestureId, setSelectedGestureId] = useState("touchpad");
  const [previewId, setPreviewId] = useState(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [interactionMode, setInteractionMode] = useState("mouse");
  const [trackingStatus, setTrackingStatus] = useState("Mouse controls active");
  const [controlTarget, setControlTarget] = useState({ rotation: FRONT_ROTATION, cameraDistance: BASE_CAMERA_DISTANCE });
  const [anchorOverrides, setAnchorOverrides] = useState({});
  const [debugOptions, setDebugOptions] = useState({ open: false, anchorDebug: false, showBounds: false, showAxes: false });
  const [hotspotScale, setHotspotScale] = useState(1.2);
  const [modelGlobalScale, setModelGlobalScale] = useState(1);
  const [pivotOffset, setPivotOffset] = useState([0, 0, 0]);
  const [handPointer, setHandPointer] = useState(null);

  const personaJourney = useMemo(() => personaJourneys.find((item) => item.id === personaId) || personaJourneys[0], [personaId]);
  const stage = useMemo(() => journeyStages.find((item) => item.id === stageId) || journeyStages[0], [stageId]);
  const gesture = useMemo(() => gestures.find((item) => item.id === selectedGestureId) || gestures[0], [selectedGestureId]);
  const activeGesture = useMemo(() => gestures.find((item) => item.id === previewId) || gesture, [gesture, previewId]);
  const activeMoment = personaJourney.moments[activeGesture.id] || personaJourney.moments.touchpad;

  const handleTargetChange = useCallback((next) => {
    setControlTarget((current) => ({
      rotation: next.rotation || current.rotation,
      cameraDistance: next.cameraDistance ?? current.cameraDistance
    }));
  }, []);

  const setMouseFallbackMode = useCallback(() => {
    setInteractionMode("mouse");
  }, []);

  useEffect(() => {
    setStageId(personaJourney.defaultStageId);
    setSelectedGestureId("touchpad");
    setPreviewId(null);
  }, [personaJourney]);

  useEffect(() => {
    setPreviewId(null);
    setControlTarget((current) => ({
      ...current,
      rotation: getFocusRotation(stage)
    }));
  }, [stage]);

  useEffect(() => {
    if (!autoPlay) return undefined;

    const interval = window.setInterval(() => {
      setStageId((current) => {
        const index = journeyStages.findIndex((item) => item.id === current);
        return journeyStages[(index + 1) % journeyStages.length].id;
      });
    }, 5200);

    return () => window.clearInterval(interval);
  }, [autoPlay]);

  return (
    <AppErrorBoundary>
      <div className="app">
        <LeftPanel
          personaId={personaJourney.id}
          setPersonaId={setPersonaId}
          personaJourney={personaJourney}
          activeMoment={activeMoment}
          activeGesture={activeGesture}
          stage={stage}
          stageId={stage.id}
          setStageId={setStageId}
          autoPlay={autoPlay}
          setAutoPlay={setAutoPlay}
        />
        <AppErrorBoundary>
          <CenterStage
            gesture={gesture}
            personaJourney={personaJourney}
            previewId={previewId}
            setPreviewId={setPreviewId}
            setSelectedGestureId={setSelectedGestureId}
            interactionMode={interactionMode}
            setInteractionMode={setInteractionMode}
            controlTarget={controlTarget}
            onTargetChange={handleTargetChange}
            trackingStatus={trackingStatus}
            setTrackingStatus={setTrackingStatus}
            setMouseFallbackMode={setMouseFallbackMode}
            handPointer={handPointer}
            setHandPointer={setHandPointer}
            anchorOverrides={anchorOverrides}
            setAnchorOverrides={setAnchorOverrides}
            debugOptions={debugOptions}
            setDebugOptions={setDebugOptions}
            hotspotScale={hotspotScale}
            setHotspotScale={setHotspotScale}
            modelGlobalScale={modelGlobalScale}
            setModelGlobalScale={setModelGlobalScale}
            pivotOffset={pivotOffset}
            setPivotOffset={setPivotOffset}
          />
        </AppErrorBoundary>
      </div>
    </AppErrorBoundary>
  );
}

export default App;
