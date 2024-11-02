// 扩展 Jest 匹配器类型
declare global {
    namespace jest {
      interface Matchers<R> {
        toHaveTextContent(text: string): R;
        toBeInTheDocument(): R;
        // 添加其他常用的匹配器
        toBeVisible(): R;
        toBeDisabled(): R;
        toHaveClass(className: string): R;
        toHaveAttribute(attr: string, value?: string): R;
      }
    }
  }