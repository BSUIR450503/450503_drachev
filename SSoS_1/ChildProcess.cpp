#ifdef _WIN32
#include <windows.h>
#include <conio.h>
#include <iostream>
#endif

#ifdef __linux__
#include <stdlib.h>
#include <unistd.h>
#include <iostream>
#endif

using namespace std;

int main(int argc, char* argv[])
{
	double number;
#ifdef _WIN32

	HANDLE namedPipe = CreateFile(TEXT("\\\\.\\pipe\\ipctest"),
		GENERIC_READ | GENERIC_WRITE,
		0,
		NULL,
		OPEN_EXISTING,
		0,
		NULL);

	if (namedPipe == INVALID_HANDLE_VALUE)
	{
		cout << "Cant create pipe. Error " << GetLastError() << endl;
	}

	DWORD numRead;
	DWORD numToWrite;

	ReadFile(namedPipe, &number, sizeof(double), &numRead, NULL);

	number *= number;

	WriteFile(namedPipe, &number, sizeof(double), &numToWrite, NULL);

#endif

#ifdef __linux__

	int fileDesc[2];

	fileDesc[0] = atoi(argv[0]);
	fileDesc[1] = atoi(argv[1]);

	read(fileDesc[0], &number, sizeof(double));
	close(fileDesc[0]);

	number *= number;

	write(fileDesc[1], &number, sizeof(double));
	close(fileDesc[1]);

#endif
}
