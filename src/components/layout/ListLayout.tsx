interface ListLayoutProps {
  listBarComponent?: React.ReactNode;
  children?: React.ReactNode;
}

const ListLayout: React.FC<ListLayoutProps> = props => {
  const { listBarComponent, children } = props;
  return (
    <>
      <div id="list-bar" className="border-color flex min-h-12 items-center border-b-1">
        {listBarComponent}
      </div>
      <div className="relative! flex h-full w-full flex-grow flex-col overflow-auto">{children}</div>
    </>
  );
};

export default ListLayout;
