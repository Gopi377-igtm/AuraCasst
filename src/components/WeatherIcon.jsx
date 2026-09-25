import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning
} from 'lucide-react';

const iconMap = {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning
};

export default function WeatherIcon({ name = 'Sun', className = 'w-6 h-6' }) {
  const IconComponent = iconMap[name] || Sun;
  return <IconComponent className={className} />;
}
