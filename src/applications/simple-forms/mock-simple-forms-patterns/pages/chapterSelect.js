import React from 'react';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const DeselectAll = ({ formData, setFormData }) => {
  const onClick = () => {
    setFormData({
      ...formData,
      chapterSelect: {},
    });
  };

  return <va-button text="Deselect all" onClick={onClick} uswds />;
};

/** @type {PageSchema} */
export default {
  ContentBeforeButtons: DeselectAll,
  uiSchema: {
    ...titleUI('Chapter select'),
    chapterSelect: checkboxGroupUI({
      title: 'Chapters to include in this form',
      required: true,
      labels: {
        textInput: 'Text input',
        numberInput: 'Number input',
        checkbox: 'Checkbox',
        select: 'Select',
        radio: 'Radio',
        date: 'Date',
        arraySinglePage: 'Array single page',
        arrayMultiPageAggregate: 'Array Multi-Page Aggregate',
        arrayMultiPageBuilder: 'Array Multi-Page Builder',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      chapterSelect: checkboxGroupSchema([
        'textInput',
        'numberInput',
        'checkbox',
        'radio',
        'select',
        'date',
        'arraySinglePage',
        'arrayMultiPageAggregate',
        'arrayMultiPageBuilder',
      ]),
    },
    required: ['chapterSelect'],
  },
};