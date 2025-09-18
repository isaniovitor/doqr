import Image from "next/image";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white py-4 flex items-center justify-center border-b border-gray-50">
      <div className="max-w-[80%] w-full flex items-center justify-between">
        <div className="flex gap-2 items-center ">
          <Image src="/logo.svg" alt="logo" width={32} height={32} priority />
          <strong>Test Doqr</strong>
        </div>

        <div className="flex gap-2 items-center ">
          <Image
            className="rounded-full"
            src="/me.png"
            alt="logo"
            width={24}
            height={24}
            priority
          />
          <strong> Isânio Vitor</strong>
        </div>
      </div>
    </header>
  );
};

export default Header;
