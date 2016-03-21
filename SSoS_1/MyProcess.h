#ifdef _WIN32
#include <Windows.h>
#endif // WIN32

#ifdef __linux__
#include <unistd.h>
#include <sys/wait.h>
#endif

#include <iostream>
#include <stdio.h>
#include <stdlib.h>
using namespace std;

class MyProcess
{
#ifdef _WIN32
	DWORD numWritten;
	DWORD numToRead;
	STARTUPINFO startupInfo;
	PROCESS_INFORMATION pi;
	HANDLE np;
#endif
#ifdef __linux__
	int fileDesc[2];
#endif
	double number;

#ifdef _WIN32
	char child[20] = "ChildProcess.exe";
#endif
#ifdef __linux__
	char child[20] = "ChildProcess";
#endif
public:
	MyProcess(int, char**);
	void CreateMyPipe() {
#ifdef _WIN32
		np = CreateNamedPipe(
			TEXT("\\\\.\\pipe\\ipctest"),
			PIPE_ACCESS_DUPLEX,
			PIPE_TYPE_BYTE | PIPE_READMODE_BYTE | PIPE_WAIT,
			1,
			512,
			512,
			NMPWAIT_USE_DEFAULT_WAIT,
			NULL);

		if (np == INVALID_HANDLE_VALUE)
		{
			cout << "Can't create pipe. Error " << GetLastError();
		}
#endif // WIN32
#ifdef __linux__
		if (pipe(fileDesc) == -1)
		{
			cout << "Can't open pipe" << endl;
		}
#endif
	}
};

