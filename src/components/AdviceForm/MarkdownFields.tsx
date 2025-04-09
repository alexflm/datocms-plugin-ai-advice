import React from 'react';
import { TextareaField } from 'datocms-react-ui';
import { Advice } from '../../models/advice';

interface MarkdownFieldsProps {
  advice: Advice;
  onFieldChange: <K extends keyof Advice>(field: K, value: Advice[K]) => void;
}

export default function MarkdownFields({ advice, onFieldChange }: MarkdownFieldsProps) {
  return (
    <div className="markdown-fields-container">
      <h3 className="markdown-section-title">AI Prompt Settings</h3>

      <div className="field-container">
        <TextareaField
          id={`contextPrompt_${advice.id}`}
          name={`contextPrompt_${advice.id}`}
          label="Context Prompt *"
          value={advice.contextPrompt || ''}
          onChange={(newValue) => onFieldChange('contextPrompt', newValue)}
          placeholder="Describe the general role and task for AI"
          textareaInputProps={{ 
            style: { 
              fontFamily: 'monospace',
              fontSize: '14px',
              minHeight: '120px',
              resize: 'vertical'
            }
          }}
          hint="General description of AI role and task. For example: 'You are an SEO optimization expert...'"
        />
      </div>

      <div className="field-container">
        <TextareaField
          id={`requirementsPrompt_${advice.id}`}
          name={`requirementsPrompt_${advice.id}`}
          label="Requirements *"
          value={advice.requirementsPrompt || ''}
          onChange={(newValue) => onFieldChange('requirementsPrompt', newValue)}
          placeholder="Define evaluation criteria and requirements"
          textareaInputProps={{ 
            style: { 
              fontFamily: 'monospace',
              fontSize: '14px',
              minHeight: '120px',
              resize: 'vertical'
            }
          }}
          hint="Evaluation criteria and requirements for AI responses. For example: 'Responses should include...'"
        />
      </div>

      <div className="field-container">
        <TextareaField
          id={`examplesPrompt_${advice.id}`}
          name={`examplesPrompt_${advice.id}`}
          label="Examples"
          value={advice.examplesPrompt || ''}
          onChange={(newValue) => onFieldChange('examplesPrompt', newValue)}
          placeholder="Add examples of queries and responses"
          textareaInputProps={{ 
            style: { 
              fontFamily: 'monospace',
              fontSize: '14px',
              minHeight: '120px',
              resize: 'vertical'
            }
          }}
          hint="Examples of queries and responses for AI training. For example: 'Query: How to optimize...' etc."
        />
      </div>

      <div className="field-container">
        <TextareaField
          id={`resultFormatPrompt_${advice.id}`}
          name={`resultFormatPrompt_${advice.id}`}
          label="Result Format *"
          value={advice.resultFormatPrompt || ''}
          onChange={(newValue) => onFieldChange('resultFormatPrompt', newValue)}
          placeholder="Specify the expected response structure"
          textareaInputProps={{ 
            style: { 
              fontFamily: 'monospace',
              fontSize: '14px',
              minHeight: '120px',
              resize: 'vertical'
            }
          }}
          hint="Expected AI response structure. For example: 'Response should contain a heading, then...'"
        />
      </div>
    </div>
  );
} 