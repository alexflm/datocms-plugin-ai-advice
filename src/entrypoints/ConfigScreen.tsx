import { useState } from 'react';
import type { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, ContextInspector, Button, Form, FieldGroup } from 'datocms-react-ui';
import s from './styles.module.css';
import { getPluginParameters, PluginParameters } from '../models/pluginParameters';
import { Advice, createDefaultAdvice } from '../models/advice';
import AdviceItem from '../components/AdviceItem';

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  const [parameters, setParameters] = useState<PluginParameters>(
    getPluginParameters(ctx.plugin.attributes.parameters as Record<string, any>)
  );

  const addAdvice = () => {
    const newAdvice = createDefaultAdvice();
    const updatedParameters = {
      ...parameters,
      advices: [...parameters.advices, newAdvice]
    };
    
    setParameters(updatedParameters);
    ctx.updatePluginParameters(updatedParameters as unknown as Record<string, unknown>);
  };

  const updateAdvice = (updatedAdvice: Advice) => {
    setParameters(prev => ({
      ...prev,
      advices: prev.advices.map(advice => 
        advice.id === updatedAdvice.id ? updatedAdvice : advice
      )
    }));
  };

  const saveAdvice = (adviceToSave: Advice) => {
    const updatedParameters = {
      ...parameters,
      advices: parameters.advices.map(advice => 
        advice.id === adviceToSave.id ? adviceToSave : advice
      )
    };
    
    setParameters(updatedParameters);
    ctx.updatePluginParameters(updatedParameters as unknown as Record<string, unknown>);
  };

  const deleteAdvice = (id: string) => {
    const updatedParameters = {
      ...parameters,
      advices: parameters.advices.filter(advice => advice.id !== id)
    };
    
    setParameters(updatedParameters);
    ctx.updatePluginParameters(updatedParameters as unknown as Record<string, unknown>);
  };

  const duplicateAdvice = (adviceToDuplicate: Advice) => {
    // Create a duplicate advice with a new ID
    const duplicatedAdvice: Advice = {
      ...adviceToDuplicate,
      id: `advice_${Date.now()}`,
      name: `${adviceToDuplicate.name} (copy)`
    };
    
    // Add the duplicate to the list of advices
    const updatedParameters = {
      ...parameters,
      advices: [...parameters.advices, duplicatedAdvice]
    };
    
    setParameters(updatedParameters);
    ctx.updatePluginParameters(updatedParameters as unknown as Record<string, unknown>);
  };

  return (
    <Canvas ctx={ctx}>
      <Form>
        <FieldGroup>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Advices</h3>
              <Button 
                onClick={addAdvice} 
                buttonType="primary" 
                buttonSize="s"
              >
                Add advice
              </Button>
            </div>
            
            {parameters.advices.length > 0 ? (
              parameters.advices.map(advice => (
                <AdviceItem 
                  key={advice.id}
                  advice={advice}
                  onUpdate={updateAdvice}
                  onDelete={deleteAdvice}
                  onSave={saveAdvice}
                  onDuplicate={duplicateAdvice}
                />
              ))
            ) : (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                border: '1px dashed #e0e0e0',
                color: '#666',
                height: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                No advices created. Click "Add advice" to create a new advice.
              </div>
            )}
          </div>
        </FieldGroup>
      </Form>
      
      <div className={s.inspector}>
        <ContextInspector />
      </div>
    </Canvas>
  );
}
