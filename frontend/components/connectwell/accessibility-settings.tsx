'use client';
export type AccessibilityPreferences={largeText:boolean;highContrast:boolean;reducedMotion:boolean};
export function AccessibilitySettings({value,onChange}:{value:AccessibilityPreferences;onChange:(next:AccessibilityPreferences)=>void}) {
 const fields:[keyof AccessibilityPreferences,string][]=[
 ['largeText','Larger text'],['highContrast','High contrast'],['reducedMotion','Reduce animation']];
 return <fieldset className="cw-accessibility"><legend>Accessibility preferences</legend>
 {fields.map(([key,label])=><label key={key} className="cw-accessibility-option">
 <input type="checkbox" checked={value[key]} onChange={e=>onChange({...value,[key]:e.target.checked})}/>{label}</label>)}
 </fieldset>;
}
