import { useEffect, useState, useRef } from 'react';

function CustomCKEditor({ onChange, name, value }) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef({});

  useEffect(() => {
    async function loadEditor() {
      editorRef.current.CKEditor =
        require('@ckeditor/ckeditor5-react').CKEditor;
      editorRef.current.ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
      setEditorLoaded(true);
    }
    loadEditor();
  }, []);

  // const { CKEditor, ClassicEditor } = editorRef.current
  // const CKEditor = editorRef.current?.CKEditor
  // const ClassicEditor = editorRef.current?.ClassicEditor

  return (
    <>
      {editorLoaded &&
        editorRef.current.CKEditor &&
        editorRef.current.ClassicEditor && (
          <editorRef.current.CKEditor
            editor={editorRef.current.ClassicEditor}
            data={value}
            onChange={(event, editor) => {
              const data = editor.getData();
              onChange(data);
            }}
            config={{
              toolbar: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                'blockQuote'
              ]
            }}
          />
        )}
    </>
  );
}

export default CustomCKEditor;
