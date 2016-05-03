#include "myprocess.h"

MyProcess::MyProcess(int argc, char* argv[])
{
	CreateMyPipe();

#ifdef _WIN32
	TCHAR CommandLine[] = TEXT("ChildProcess.exe");
	ZeroMemory(&startupInfo, sizeof(startupInfo));
	startupInfo.cb = sizeof(startupInfo);
	ZeroMemory(&pi, sizeof(pi));

	if (!(CreateProcess(
		NULL,
		CommandLine,
		NULL,
		NULL,
		FALSE,
		0,
		NULL,
		NULL,
		&startupInfo,
		&pi
		)))
	{
		cout << "Can't create process" << GetLastError() << endl;
	}

	ConnectNamedPipe(np, NULL);
#endif
#ifdef __linux__
	pid_t pid = fork();

	if (pid == 0)
	{
		char readDesc[4], writeDesc[4];
		sprintf(readDesc, "%d", fileDesc[0]);
		sprintf(writeDesc, "%d", fileDesc[1]);
		execl("ChildProcess", readDesc, writeDesc, NULL);
	}
	else if (pid < 0)
	{
		std::cout << "Can't fork process" << std::endl;
	}
	else if (pid > 0)
	{
#endif

		cout << "Enter number: ";
		cin >> number;
#ifdef __linux__
		write(fileDesc[1], &number, sizeof(double));
		close(fileDesc[1]);
		wait(NULL);
		read(fileDesc[0], &number, sizeof(double));
		close(fileDesc[0]);
	}
#endif
#ifdef WIN32
	WriteFile(np, &number, sizeof(double), &numWritten, NULL);
	//WaitForSingleObject(pi.hProcess, INFINITE);
	ReadFile(np, &number, sizeof(double), &numToRead, NULL);

	CloseHandle(pi.hProcess);
	CloseHandle(np);
#endif // _WIN32

	cout << "x^2 = " << number << endl;
#ifdef WIN32
	system("pause");
#endif // _WIN32
}
