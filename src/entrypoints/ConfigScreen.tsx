import { useState, useRef } from 'react';
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
  const [newAdviceId, setNewAdviceId] = useState<string | null>(null);

  const addAdvice = () => {
    const newAdvice = createDefaultAdvice();
    const updatedParameters = {
      ...parameters,
      advices: [...parameters.advices, newAdvice]
    };
    
    setParameters(updatedParameters);
    setNewAdviceId(newAdvice.id);
    // Не сохраняем параметры плагина сразу при добавлении
    // ctx.updatePluginParameters(updatedParameters as unknown as Record<string, unknown>);
  };

  const updateAdvice = (updatedAdvice: Advice) => {
    const adviceWithTimestamp = {
      ...updatedAdvice,
      lastUpdated: Date.now()
    };

    setParameters(prev => ({
      ...prev,
      advices: prev.advices.map(advice => 
        advice.id === adviceWithTimestamp.id ? adviceWithTimestamp : advice
      )
    }));
  };

  const saveAdvice = (adviceToSave: Advice) => {
    const now = Date.now();
    
    // Добавляем createdAt, если его нет (для обратной совместимости)
    const adviceWithTimestamp = {
      ...adviceToSave,
      lastUpdated: now,
      createdAt: adviceToSave.createdAt || now
    };

    const updatedParameters = {
      ...parameters,
      advices: parameters.advices.map(advice => 
        advice.id === adviceWithTimestamp.id ? adviceWithTimestamp : advice
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
    const now = Date.now();
    // Create a duplicate advice with a new ID
    const duplicatedAdvice: Advice = {
      ...adviceToDuplicate,
      id: `advice_${now}`,
      name: `${adviceToDuplicate.name} (copy)`,
      lastUpdated: now,
      createdAt: now
    };
    
    // Add the duplicate to the list of advices
    const updatedParameters = {
      ...parameters,
      advices: [...parameters.advices, duplicatedAdvice]
    };
    
    setParameters(updatedParameters);
    setNewAdviceId(duplicatedAdvice.id);
    ctx.updatePluginParameters(updatedParameters as unknown as Record<string, unknown>);
  };
  
  // Сортировка советов по дате создания от самых старых к самым новым
  const sortedAdvices = [...parameters.advices].sort((a, b) => {
    // Используем поле createdAt для сортировки
    const timeA = a.createdAt || 0;
    const timeB = b.createdAt || 0;
    return timeA - timeB;
  });

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
              sortedAdvices.map(advice => (
                <AdviceItem 
                  key={advice.id}
                  advice={advice}
                  onUpdate={updateAdvice}
                  onDelete={deleteAdvice}
                  onSave={saveAdvice}
                  onDuplicate={duplicateAdvice}
                  isNew={advice.id === newAdviceId}
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
