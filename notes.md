# ChipJS

This is a description of what ChipJS is and various notes on its development.

CHIP-8 is an old game development language from the 1970s, based entirely on hexadecimal instructions known as "opcodes" to manipulate data in memory. ChipJS is an implementation of a CHIP-8-like machine and interpreter, kept entirely separate from any sort of opinion on graphics rendering (libraries, etc.).

## Components

A typical CHIP-8 machine has memory structure as such:

> [[...] a 64x32 pixel monochrome display, a little less than 4k of shared program/data space (some of the VIP's low memory is reserved for the interpreter), a 16-level return stack, 16 general-purpose 8-bit registers (the 16th is used as a status flag by some instructions), a 16-button hex keypad (with a really goofy layout) and a "buzzer" which can make some unspecified noise.](http://forums.somethingawful.com/showthread.php?threadid=3634812&userid=0&perpage=40&pagenumber=1#post429728908)

The CHIP-8 language also has particular behavior:

> [The thirty-one instructions comprising the original CHIP-8 instruction set provide utilities for primitive audio and monochrome video output, user input, and data manipulation. CHIP-8 enjoyed relative success during the late 1970s and early 1980s as a popular language for the development of simple video games, and even spawned a multitude of dialects providing additional features.](http://mattmik.com/chip8.html)


ChipJS will emulate a CHIP-8 machine and the CHIP-8 language via state and behavior, which implies object-oriented programming. Therefore, it is necessary to elaborate what ChipJS *is* and what ChipJS *does*.

- ChipJS has:
  - 4096 bytes of **RAM**
    - in classic machines, addresses 0x000 through 0x1FF are taken up by the language interpreter, but that will not be the case in ChipJS
    - regardless, ChipJS will assume all programs begin at 0x200 in memory
  - 16 **8-bit registers**, V0 through VF
    - hold numbers between 0 and 255, or 0x00 and 0xFF
    - VF is commonly used as a "status" flag
  - a 12-bit **address register**, I
    - used for keeping track of an address in memory
    - e.g. 0x200, 0x3FF
  - a 16-level **return stack**
    - essentially a stack of 12-bit addresses like I
    - allows for subroutines
  - a **program counter**
    - keeps track of where in memory the program is currently executing
  - a **stack pointer**
    - keeps track of the position in the subroutine stack
  - a **pixel display**, implemented as a 2D array
    - 64x32 pixels, potentially other sizes as well
  - an 8-bit **sound timer** register
  - an 8-bit **delay timer** register
- ChipJS does:
  - 35 different commands known as *opcodes*

## Opcode Table (via [Mastering CHIP-8](http://mattmik.com/chip8.html))

| Opcode | Operation |
| ------ | --------- |
| 0NNN | Execute machine language subroutine at address NNN (more or less deprecated) |
| 00E0 | Clear the screen |
| 00EE | Return from a subroutine |
| 1NNN | Jump to address NNN |
| 2NNN | Execute subroutine starting at address NNN |
| 3XNN | Skip the following instruction if the value of register VX equals NN |
| 4XNN | Skip the following instruction if the value of register VX is not equal to NN |
| 5XY0 | Skip the following instruction if the value of register VX is equal to the value of register VY |
| 6XNN | Store number NN in register VX |
| 7XNN | Add the value NN to register VX |
| 8XY0 | Store the value of register VY in register VX |
| 8XY1 | Set VX to VX OR VY |
| 8XY2 | Set VX to VX AND VY |
| 8XY3 | Set VX to VX XOR VY |
| 8XY4 | Add the value of register VY to register VX; Set VF to 01 if a carry occurs; Set VF to 00 if a carry does not occur |
| 8XY5 | Subtract the value of register VY from register VX; Set VF to 00 if a borrow occurs; Set VF to 01 if a borrow does not occur |
| 8XY6 | Store the value of register VY shifted right one bit in register VX; Set register VF to the least significant bit prior to the shift |
| 8XY7 | Set register VX to the value of VY minus VX; Set VF to 00 if a borrow occurs; Set VF to 01 if a borrow does not occur |
| 8XYE | Store the value of register VY shifted left one bit in register VX; Set register VF to the most significant bit prior to the shift |
| 9XY0 | Skip the following instruction if the value of register VX is not equal to the value of register VY |
| ANNN | Store memory address NNN in register I |
| BNNN | Jump to address NNN + V0 |
| CXNN | Set VX to a random number with a mask of NN |
| DXYN | Draw a sprite at position VX, VY with N bytes of sprite data starting at the address stored in I; Set VF to 01 if any set pixels are changed to unset, and 00 otherwise |
| EX9E | Skip the following instruction if the key corresponding to the hex value currently stored in register VX is pressed |
| EXA1 | Skip the following instruction if the key corresponding to the hex value currently stored in register VX is not pressed |
| FX07 | Store the current value of the delay timer in register VX |
| FX0A | Wait for a keypress and store the result in register VX |
| FX15 | Set the delay timer to the value of register VX |
| FX18 | Set the sound timer to the value of register VX |
| FX1E | Add the value stored in register VX to register I |
| FX29 | Set I to the memory address of the sprite data corresponding to the hexadecimal digit stored in register VX |
| FX33 | Store the binary-coded decimal equivalent of the value stored in register VX at addresses I, I+1, and I+2 |
| FX55 | Store the values of registers V0 to VX inclusive in memory starting at address I; I is set to I + X + 1 after operation |
| FX65 | Fill registers V0 to VX inclusive with the values stored in memory starting at address I; I is set to I + X + 1 after operation |

## Resources

- [Mastering CHIP-8](http://mattmik.com/chip8.html)
- [How to write a CHIP-8 interpreter](http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/)