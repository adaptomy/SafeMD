import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkEmoji from 'remark-emoji';
import { Box, TextField, ThemeProvider, createTheme, CssBaseline, Button, ButtonGroup, AppBar, Toolbar, Typography, IconButton, ToggleButtonGroup, ToggleButton, Tooltip, Snackbar, Alert } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TurndownService from 'turndown';
import { marked } from 'marked';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const turndownService = new TurndownService();

function App() {
  const [markdown, setMarkdown] = useState<string>('# Hello SafeMD\n\nThis is a simple Markdown editor.\n\n## Features\n\n- Real-time preview\n- GitHub Flavored Markdown (tables, task lists)\n- Code highlighting\n- Emojis :smile:\n\n| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n\n- [x] Task 1\n- [ ] Task 2\n\n```javascript\nconsole.log(\"Hello, world!\");\n```');
  const [editMode, setEditMode] = useState<'markdown' | 'gui'>('gui');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const tiptapEditor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: marked.parse(markdown),
    onUpdate: ({ editor }) => {
      setMarkdown(turndownService.turndown(editor.getHTML()));
    },
  });

  useEffect(() => {
    if (tiptapEditor && editMode === 'gui') {
      tiptapEditor.commands.setContent(marked.parse(markdown), false);
    }
  }, [editMode, markdown, tiptapEditor]);

  const applyMarkdown = (prefix: string, suffix: string = '') => {
    if (editorRef.current) {
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdown.substring(start, end);

      const newMarkdown = markdown.substring(0, start) +
                          prefix + selectedText + suffix +
                          markdown.substring(end);
      setMarkdown(newMarkdown);

      // カーソル位置を調整
      setTimeout(() => {
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = end + prefix.length;
        textarea.focus();
      }, 0);
    }
  };

  const applyHeader = (level: number) => {
    if (editorRef.current) {
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdown.substring(start, end);
      const headerPrefix = '#'.repeat(level) + ' ';

      const newMarkdown = markdown.substring(0, start) +
                          headerPrefix + selectedText + '\n' +
                          markdown.substring(end);
      setMarkdown(newMarkdown);

      setTimeout(() => {
        textarea.selectionStart = start + headerPrefix.length;
        textarea.selectionEnd = end + headerPrefix.length;
        textarea.focus();
      }, 0);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setSnackbarOpen(true);
    }).catch(err => {
      console.error('Failed to copy markdown: ', err);
    });
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SafeMD Editor
            </Typography>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button onClick={() => setEditMode('markdown')} disabled={editMode === 'markdown'}>Markdown Mode</Button>
              <Button onClick={() => setEditMode('gui')} disabled={editMode === 'gui'}>GUI Mode</Button>
            </ButtonGroup>
            {editMode === 'gui' && (
              <Tooltip title="マークダウンをコピー">
                <IconButton color="inherit" onClick={handleCopyMarkdown} sx={{ ml: 2 }}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', flex: 1 }}>
          {editMode === 'markdown' ? (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                <ToggleButtonGroup size="small" exclusive>
                  <Tooltip title="太字"><ToggleButton value="bold" onClick={() => applyMarkdown('**', '**')}><FormatBoldIcon /></ToggleButton></Tooltip>
                  <Tooltip title="斜体"><ToggleButton value="italic" onClick={() => applyMarkdown('*', '*')}><FormatItalicIcon /></ToggleButton></Tooltip>
                  <Tooltip title="打ち消し線"><ToggleButton value="strikethrough" onClick={() => applyMarkdown('~~', '~~')}><StrikethroughSIcon /></ToggleButton></Tooltip>
                </ToggleButtonGroup>
                <ToggleButtonGroup size="small" exclusive>
                  <Tooltip title="リンク"><ToggleButton value="link" onClick={() => applyMarkdown('[', '](url)')}><LinkIcon /></ToggleButton></Tooltip>
                  <Tooltip title="画像"><ToggleButton value="image" onClick={() => applyMarkdown('![alt](', ')')}><ImageIcon /></ToggleButton></Tooltip>
                  <Tooltip title="コードブロック"><ToggleButton value="code" onClick={() => applyMarkdown('```\n', '\n```')}><CodeIcon /></ToggleButton></Tooltip>
                </ToggleButtonGroup>
                <ToggleButtonGroup size="small" exclusive>
                  <Tooltip title="箇条書き"><ToggleButton value="bullet" onClick={() => applyMarkdown('- ')}><FormatListBulletedIcon /></ToggleButton></Tooltip>
                  <Tooltip title="番号付きリスト"><ToggleButton value="numbered" onClick={() => applyMarkdown('1. ')}><FormatListNumberedIcon /></ToggleButton></Tooltip>
                  <Tooltip title="引用"><ToggleButton value="quote" onClick={() => applyMarkdown('> ')}><FormatQuoteIcon /></ToggleButton></Tooltip>
                  <Tooltip title="水平線"><ToggleButton value="hr" onClick={() => applyMarkdown('---\n')}><HorizontalRuleIcon /></ToggleButton></Tooltip>
                </ToggleButtonGroup>
                <ToggleButtonGroup size="small" exclusive>
                  <Tooltip title="見出し1"><ToggleButton value="h1" onClick={() => applyHeader(1)}><LooksOneIcon /></ToggleButton></Tooltip>
                  <Tooltip title="見出し2"><ToggleButton value="h2" onClick={() => applyHeader(2)}><LooksTwoIcon /></ToggleButton></Tooltip>
                  <Tooltip title="見出し3"><ToggleButton value="h3" onClick={() => applyHeader(3)}><Looks3Icon /></ToggleButton></Tooltip>
                </ToggleButtonGroup>
              </Box>
              <TextField
                multiline
                fullWidth
                variant="outlined"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                inputRef={editorRef}
                sx={{
                  flex: 1,
                  padding: '20px',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  '& .MuiInputBase-input': {
                    height: '100%',
                    overflowY: 'auto',
                    resize: 'none',
                  },
                }}
              />
            </Box>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
              <Box sx={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {tiptapEditor && (
                  <>
                    <ToggleButtonGroup size="small" exclusive>
                      <Tooltip title="太字"><ToggleButton value="bold" onClick={() => tiptapEditor.chain().focus().toggleBold().run()} selected={tiptapEditor.isActive('bold')}><FormatBoldIcon /></ToggleButton></Tooltip>
                      <Tooltip title="斜体"><ToggleButton value="italic" onClick={() => tiptapEditor.chain().focus().toggleItalic().run()} selected={tiptapEditor.isActive('italic')}><FormatItalicIcon /></ToggleButton></Tooltip>
                      <Tooltip title="打ち消し線"><ToggleButton value="strike" onClick={() => tiptapEditor.chain().focus().toggleStrike().run()} selected={tiptapEditor.isActive('strike')}><StrikethroughSIcon /></ToggleButton></Tooltip>
                      <Tooltip title="コード"><ToggleButton value="code" onClick={() => tiptapEditor.chain().focus().toggleCode().run()} selected={tiptapEditor.isActive('code')}><CodeIcon /></ToggleButton></Tooltip>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup size="small" exclusive>
                      <Tooltip title="見出し1"><ToggleButton value="h1" onClick={() => tiptapEditor.chain().focus().toggleHeading({ level: 1 }).run()} selected={tiptapEditor.isActive('heading', { level: 1 })}><LooksOneIcon /></ToggleButton></Tooltip>
                      <Tooltip title="見出し2"><ToggleButton value="h2" onClick={() => tiptapEditor.chain().focus().toggleHeading({ level: 2 }).run()} selected={tiptapEditor.isActive('heading', { level: 2 })}><LooksTwoIcon /></ToggleButton></Tooltip>
                      <Tooltip title="見出し3"><ToggleButton value="h3" onClick={() => tiptapEditor.chain().focus().toggleHeading({ level: 3 }).run()} selected={tiptapEditor.isActive('heading', { level: 3 })}><Looks3Icon /></ToggleButton></Tooltip>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup size="small" exclusive>
                      <Tooltip title="箇条書き"><ToggleButton value="bulletList" onClick={() => tiptapEditor.chain().focus().toggleBulletList().run()} selected={tiptapEditor.isActive('bulletList')}><FormatListBulletedIcon /></ToggleButton></Tooltip>
                      <Tooltip title="番号付きリスト"><ToggleButton value="orderedList" onClick={() => tiptapEditor.chain().focus().toggleOrderedList().run()} selected={tiptapEditor.isActive('orderedList')}><FormatListNumberedIcon /></ToggleButton></Tooltip>
                      <Tooltip title="引用"><ToggleButton value="blockquote" onClick={() => tiptapEditor.chain().focus().toggleBlockquote().run()} selected={tiptapEditor.isActive('blockquote')}><FormatQuoteIcon /></ToggleButton></Tooltip>
                      <Tooltip title="水平線"><ToggleButton value="horizontalRule" onClick={() => tiptapEditor.chain().focus().setHorizontalRule().run()}><HorizontalRuleIcon /></ToggleButton></Tooltip>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup size="small" exclusive>
                      <Tooltip title="リンク"><ToggleButton value="link" onClick={() => {
                        const url = window.prompt('URL');
                        if (url) {
                          tiptapEditor.chain().focus().setLink({ href: url }).run();
                        }
                      }} selected={tiptapEditor.isActive('link')}><LinkIcon /></ToggleButton></Tooltip>
                      <Tooltip title="画像"><ToggleButton value="image" onClick={() => {
                        const url = window.prompt('URL');
                        if (url) {
                          tiptapEditor.chain().focus().setImage({ src: url }).run();
                        }
                      }}><ImageIcon /></ToggleButton></Tooltip>
                    </ToggleButtonGroup>
                  </>
                )}
              </Box>
              {tiptapEditor && <EditorContent editor={tiptapEditor} />}
            </Box>
          )}
          {editMode === 'markdown' && (
            <Box
              sx={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                borderLeft: '1px solid #eee',
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkEmoji]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={prism}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          マークダウンをコピーしました！
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
