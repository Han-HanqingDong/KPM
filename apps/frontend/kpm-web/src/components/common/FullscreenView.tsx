import { FullscreenOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useState, type ReactNode } from 'react';

type FullscreenViewProps = {
  title: string;
  triggerText?: string;
  children?: ReactNode;
  fullscreenChildren?: ReactNode;
};

export function FullscreenView({ title, triggerText = '全屏查看', children, fullscreenChildren }: FullscreenViewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="text" icon={<FullscreenOutlined />} onClick={() => setOpen(true)}>
        {triggerText}
      </Button>
      {children || null}
      <Modal
        title={title}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="calc(100vw - 32px)"
        centered
        destroyOnHidden
        className="kpm-fullscreen-modal"
        zIndex={1400}
      >
        <div className="kpm-fullscreen-body">
          {fullscreenChildren || children}
        </div>
      </Modal>
    </>
  );
}
