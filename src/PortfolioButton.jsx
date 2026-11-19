import React from 'react';
import SpecularButton from './SpecularButton';
import './portfolio-buttons.css';

const tones={
 glass:{tint:'#ffffff',tintOpacity:.045,textColor:'#f0eee7',blur:8},
 light:{tint:'#eee9d5',tintOpacity:.96,textColor:'#161616',blur:0},
 accent:{tint:'#ff3825',tintOpacity:1,textColor:'#ffffff',blur:0}
};

export default function PortfolioButton({tone='glass',className='',...props}){
 return <SpecularButton radius={8} size="sm" lineColor="#ffffff" baseColor="#555957"
  intensity={.9} idleIntensity={.23} shineSize={10} shineFade={34} thickness={1.1} glow={.6}
  followMouse proximity={130} autoAnimate={false} {...(tones[tone]||tones.glass)}
  className={`portfolio-button portfolio-button--${tone} ${className}`.trim()} {...props}/>;
}
