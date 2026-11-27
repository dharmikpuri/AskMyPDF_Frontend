import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// react-markdown does not render raw HTML unless rehype-raw is added, so model output
// can't inject markup. Links are forced to open safely in a new tab.
const components = {
  a: ({ node, ...props }) => {
    void node;
    return <a {...props} target="_blank" rel="noopener noreferrer" />;
  },
  table: ({ node, ...props }) => {
    void node;
    return (
      <div className="md-table-wrap">
        <table {...props} />
      </div>
    );
  },
};

export default function Markdown({ children }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
