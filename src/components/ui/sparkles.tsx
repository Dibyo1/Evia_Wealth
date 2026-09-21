import React from "react";
import Particles from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { motion } from "framer-motion";

export interface SparklesProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  speed?: number;
  particleColor?: string;
}

export const SparklesCore = (props: SparklesProps) => {
  const {
    id = "sparkles",
    className,
    background = "transparent",
    minSize = 0.6,
    maxSize = 1.4,
    particleDensity = 120,
    speed = 1,
    particleColor = "#d4af37",
  } = props;

  const particlesLoaded = async (container?: Container) => {
    // Optional container callback
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <Particles
          id={id}
          className="w-full h-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: background,
              },
            },
            fullScreen: {
              enable: false,
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: false,
                  mode: "push",
                },
                onHover: {
                  enable: false,
                  mode: "repulse",
                },
                resize: {
                  enable: true,
                },
              },
            },
            particles: {
              color: {
                value: particleColor,
              },
              move: {
                enable: true,
                speed: speed,
                direction: "none",
                random: true,
                straight: false,
                outModes: {
                  default: "out",
                },
              },
              number: {
                density: {
                  enable: true,
                  width: 400,
                  height: 400,
                },
                value: particleDensity,
              },
              opacity: {
                value: {
                  min: 0.1,
                  max: 1,
                },
                animation: {
                  enable: true,
                  speed: speed,
                  sync: false,
                },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: minSize, max: maxSize },
              },
            },
            detectRetina: true,
          }}
        />
      </motion.div>
    </div>
  );
};
