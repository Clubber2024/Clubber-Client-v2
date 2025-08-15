import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center mt-[100px] w-[100%] mb-25 ">
      <div className="flex flex-col shadow-sm w-full sm:w-[80%] pl-4 sm:pl-8 pr-4 sm:pr-8 border border-border-gray-transparent shadow-custom-light rounded-[8px]">
        {children}
      </div>
    </div>
  );
};

export default Container;
